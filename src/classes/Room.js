const { toId } = require('../util');
const { Events } = require('../util/Static');

/**
 * Represents any room on showdown
 */
class Room {
	constructor(client, data) {
		/**
		 * The client that instantiated this room
		 * @type {Client}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The unique ID of the room
		 * Used to target the room in commands
		 * @type {string}
		 */
		this.id = data.id;

		/**
		 * The name of the room. Null for some uninitialised rooms.
		 * @type {?string}
		 */
		this.name = data.name;

		/**
		 * The description of the room. Only on public chat rooms.
		 * @type {?string}
		 */
		this.description = data.description;

		/**
		 * Whether the client is in the room
		 * @type {boolean}
		 */
		this.initialized = false;

		this.messages = new Set();

		/**
		 * The type of the room, either:
		 * * `chat` - a normal chat room
		 * * `battle` - a game room
		 * * `unknown` - could be any type
		 * @type {string}
		 */
		this.type = data.type ? data.type : 'unknown';
	}

	/**
	 * Send a message to the room
	 * @param {string} message The text to send
	 * @returns {Promise<Message>} The message that was sent
	 */
	send(message) {
		if (!this.initialized) this.client.emit('warn', `Cannot message ${this.id} - not in room`);

		return new Promise((resolve, reject) => {
			if (message.startsWith('/') && !message.startsWith('//')) {
				reject(new Error(`Commands should be sent with sendraw - not sending ${message}`));
			}

			const filterResults = e => e.event === Events.CHAT &&
				e.args.message.author === this.client.user &&
				toId(e.args.message.content) === toId(message);

			this.client.messageHandler.awaitActions({
				filter: act => act.name === 'CHAT' && !!act.results.find(filterResults),
			}).then(c => {
				const action = c[0];
				resolve(action.results.pop().args.message);
			}).catch(reject);

			this.ws.send(`${this.id}|${message}`);
		});
	}

	sendRaw(message) {
		if (!this.initialized) this.client.emit('warn', `Cannot message ${this.id} - not in room`);

		this.ws.send(`${this.id}|${message}`);
	}

	/**
	 * Leave the room
	 */
	join() {
		if (this.initialized) this.client.emit('warn', `Cannot join room ${this.id} - already in room`);
		this.client.sendToGlobal(`/join ${this.id}`);
	}

	/**
	 * Leave the room
	 */
	leave() {
		if (!this.initialized) this.client.emit('warn', `Cannot leave room ${this.id} - not in room`);
		this.client.sendToGlobal(`/leave ${this.id}`);
	}

	init(type) {
		this.type = type;
		this.initialized = true;
	}

	/**
	 * All users in the room
	 * @returns {?UserStore<string, User>}
	 */
	get users() {
		return this.client.users.filter(e => e.isInRoom(this));
	}

	/**
	 * Shortcut to client.ws
	 * @type {SocketHandler}
	 * @readonly
	 * @private
	 */
	get ws() {
		return this.client.ws;
	}
}

module.exports = Room;
