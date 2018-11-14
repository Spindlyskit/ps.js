const WebSocket = require('ws');

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

		this.ws.on('open', () => this.open())
			.on('close', () => this.close())
			.on('message', m => this.message(m));
	}

	/**
	 * Called when websocket has connected
	 * @private
	 */
	open() {

	}

	/**
	 * Called when websocket has disconnected
	 * @private
	 */
	close() {

	}

	/**
	 * Called when websocket receives data
	 * @param {*} message The received data
	 * @private
	 */
	message(message) {
		console.log(message);
	}
}

module.exports = SocketHandler;
