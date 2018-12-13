const BaseClient = require('./BaseClient');
const request = require('request-promise');
const SocketHandler = require('./ws/SocketHandler');
const MessageHandler = require('./MessageHandler');
const RoomStore = require('../datastores/RoomStore');
const UserStore = require('../datastores/UserStore');
const { toId } = require('../util');
const { defaultRanks, Events } = require('../util/Static');

/**
 * Main entry point into showdown and starting point for all clients
 * @extends {BaseClient}
 */
class Client extends BaseClient {
	/**
	 * @param {ClientOptions} [options={}] The options for the client
	 */
	constructor(options) {
		super(options);

		/**
		 * All known rooms on the server
		 * @type {RoomStore<string, Room>}
		 */
		this.rooms = new RoomStore(this);
		this.rooms.getOrAdd(this.options.lobby);

		/**
		 * All known users on the server
		 * @type {UserStore<string, User>}
		 */
		this.users = new UserStore(this);

		/**
		 * The client's socket handler
		 * @type {SocketHandler}
		 */
		this.ws = new SocketHandler(this);

		/**
		 * The client's message handler
		 * @type {MessageHandler}
		 */
		this.messageHandler = new MessageHandler(this);

		/**
		 * The ranks on the server.
		 * @type {Rank[]}
		 */
		this.ranks = defaultRanks;

		/**
		 * Whether the client is logged in currently.
		 * @type {boolean}
		 */
		this.loggedIn = false;

		/**
		 * The user the client is currently logged in as.
		 * @type {User}
		 */
		this.user = null;

		/**
		 * The challstr given by the server. Used to log on.
		 * @type {?string}
		 */
		this.challstr = null;


		/**
		 * Whether the client has completed one-time post login actions
		 * @type {boolean}
		 * @private
		 */
		this._doneLoginSetup = false;
	}

	/**
	 * Run when the client is ready.
	 */
	onReady() {
		if (this.options.autoFetchRooms) this.sendToGlobal('/crq rooms');
		/**
		 * Emitted when the sockets successfully connect.
		 * @event Client#ready
		 * @param {string} info The debug information
		 */
		this.emit(Events.READY);
	}

	/**
	 * Emit a warning message.
	 * @param {string} message The message to emit.
	 */
	warn(message) {
		this.emit('warn', message);
	}

	/**
	 * Emit a warning message or Error.
	 * @param {string|Error} error The message or error to emit.
	 */
	error(error) {
		this.emit('error', error);
	}

	/**
	 * Send a message to the global room
	 * @param {string} message The message to send
	 */
	sendToGlobal(message) {
		this.ws.send(`|${message}`);
	}

	/**
	 * Run when a message is received from the server
	 * @param {string} message The message received
	 */
	handleMessage(message) {
		this.messageHandler.parseExec(message);
	}

	/**
	 * Login with the username and password provided. Requires the client to have a challstr so if the challstr has not
	 * been received yet the client will wait for it before logging in.
	 * @param {string} username The username for the user.
	 * @param {string} password The users password.
	 * @returns {Promise<User>} The client's new user object
	 * @example
	 * // Logs in as example user
	 * client.login('example', 'password123')
	 * 	.then(user => console.log(`Logged in as ${user.name}`)
	 * 	.catch(console.error);
	 */
	login(username, password) {
		return new Promise((resolve, reject) => {
			this._sendLogin(username, password);

			const matchResults = res => res.args.user.id === toId(username) &&
				res.event === Events.CLIENT_USERNAME_CHANGE &&
				res.args.loggedIn;

			this.messageHandler.awaitActions({
				filter: act => act.name === 'UPDATE_USER' && !!act.results.find(matchResults),
			}).then(c => {
				const collected = c[0];
				const args = collected.results.find(matchResults).args;
				this._postLogin();
				resolve(args.user);
			}).catch(reject);
		});
	}

	_sendLogin(username, password) {
		if (this.challstr) {
			request.post(`http${this.options.http.secure ? 's' : ''}://${this.options.loginServer}`, {
				form: {
					act: 'login',
					name: username,
					pass: password,
					challstr: this.challstr,
				},
			}).then(data => {
				data = data.substr(1);
				try {
					data = JSON.parse(data);
				} catch (e) {
					throw new Error('Unknown error with login server.');
				}

				if (!data) throw new Error('Unknown error with login server.');
				if (!data.actionsuccess) throw new Error(data.assertion.substr(2));

				this.sendToGlobal(`/trn ${username},0,${data.assertion}`);
			}).catch(err => {
				throw err;
			});
		} else {
			this.once('challstr', () => {
				this.login(username, password);
			});
		}
	}

	/**
	 * Run when the client has logged in.
	 */
	_postLogin() {
		if (this._doneLoginSetup) return;
		this._doneLoginSetup = true;

		this.options.autoJoinRooms.forEach(e => this.rooms.tryJoin(e));
	}

	/**
	 * Whether the client is ready.
	 * @readonly
	 * @returns {boolean}
	 */
	get ready() {
		return this.ws.active;
	}
}

module.exports = Client;

/**
 * Emitted for general warnings.
 * @event Client#warn
 * @param {string} info The warning
 */

/**
 * Emitted for general debugging information.
 * @event Client#debug
 * @param {string} info The debug information
 */
