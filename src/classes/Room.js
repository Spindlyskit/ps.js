/**
 * Represents any room on showdown
 */
class Room {
	constructor(client, data) {
		/**
		 * The client that instantiated this DataStore
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
		 * The name of the room
		 * @type {string}
		 */
		this.name = data.name;

		/**
		 * Whether the client is in the room
		 * @type {boolean}
		 */
		this.joined = false;

		/**
		 * The type of the room, either:
		 * * `chat` - a normal chat room
		 * * `battle` - a game room
		 * * `dm` - a dm with a user
		 * * `global` - the global room
		 * * `unknown` - could be any type
		 * @type {string}
		 */
		this.type = data.type ? data.type : 'unknown';
	}

	/**
	 * Send a message to the room
	 * @param {string} message The text to send
	 */
	send(message) {
		this.ws.send(`${this.id}|${message}`);
	}

	/**
	 * Leave the room
	 */
	join() {
		if (this.joined) this.client.emit('warn', `Cannot join room ${this.id} - already in room`);
		this.client.sendToGlobal(`/join ${this.id}`);
	}

	/**
	 * Leave the room
	 */
	leave() {
		if (!this.joined) this.client.emit('warn', `Cannot leave room ${this.id} - not in room`);
		if (this.isGlobalRoom) this.client.emit('warn', 'Global room cannot be left');
		this.client.sendToGlobal(`/leave ${this.id}`);
	}

	/**
	 * Whether this room is the global room
	 * @type {boolean}
	 * @readonly
	 */
	get isGlobalRoom() {
		return this.type === 'global';
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
