const WebSocket = require('ws');
const { Events } = require('../../util/Static');

/**
 * Interacts with showdown's websockets.
 */
class SocketHandler {
	constructor(client) {
		/**
		 * The client that instantiated this WebSocketManager
		 * @type {Client}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The websocket client
		 * @type {WebSocket}
		 * @readonly
		 */
		this.ws = new WebSocket(`ws${client.options.ws.secure ? 's' : ''}://${client.options.server}`);

		/**
		 * Whether the socket has connected
		 * @type {boolean}
		 */
		this.active = false;

		this.ws.on('open', () => this.open())
			.on('close', () => this.close())
			.on('message', m => this.message(m));
	}

	/**
	 * Called when websocket has connected
	 * @private
	 */
	open() {
		this.active = true;
		/**
		 * Emitted when the sockets successfully connect.
		 * @event Client#ready
		 * @param {string} info The debug information
		 */
		this.client.emit(Events.READY);
	}

	/**
	 * Called when websocket has disconnected
	 * @private
	 */
	close() {
		this.active = false;
		/**
		 * Emitted when the socket disconnects.
		 * @event Client#disconnect
		 * @param {string} info The debug information
		 */
		this.client.emit(Events.DISCONNECT);
	}

	/**
	 * Called when websocket receives data
	 * @param {*} message The received data
	 * @private
	 */
	message(message) {
		this.client.handleMessage(message);
		/**
		 * Emitted when the sockets receive any data.
		 * @event Client#raw
		 * @param {string} info The debug information
		 */
		this.client.emit(Events.RAW, message);
	}

	send(...params) {
		this.ws.send(...params);
	}
}

module.exports = SocketHandler;
