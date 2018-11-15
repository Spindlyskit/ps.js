const BaseClient = require('./BaseClient');
const SocketHandler = require('./ws/SocketHandler');
const GlobalRoom = require('../classes/GlobalRoom');

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
		 * The client's socket handler
		 * @type {SocketHandler}
		 */
		this.ws = new SocketHandler(this);

		/**
		 * The client's socket handler
		 * @type {SocketHandler}
		 */
		this.globalRoom = new GlobalRoom(this);
	}

	joinRoom(roomid) {
		this.globalRoom.send(`/join ${roomid}`);
	}

	/**
	 * Send a message to the global room
	 * @param {string} message The message to send
	 */
	sendToGlobal(message) {
		this.globalRoom.send(message);
	}

	handleMessage() {
		// Pass
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
