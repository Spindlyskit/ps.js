const UserStore = require('../datastores/UserStore');

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

		/**
		 * The type of the room, either:
		 * * `chat` - a normal chat room
		 * * `battle` - a game room
		 * * `unknown` - could be any type
		 * @type {string}
		 */
		this.type = data.type ? data.type : 'unknown';

		/**
		 * All users in the room.
		 * @type {?UserStore<string, User>}
		 * @private
		 */
		this._usersCache = null;
	}

	/**
	 * Send a message to the room
	 * @param {string} message The text to send
	 */
	send(message) {
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

	get users() {
		if (this._usersCache) return this._usersCache;
		this._usersCache = new UserStore(this.client, this.client.users.filter(e => e.isInRoom(this)));
		return this._usersCache;
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
