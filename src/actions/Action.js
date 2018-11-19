/**
 * Contains information about how to parse and run each message type from the server
 */
class Action {
	/**
	 * @param {Client} client The client that instantiated this action.
	 * @param {string} data The data from the server.
	 * @param {?Room} room The room the action was performed in.
	 * @param {string} name The action's name.
	 */
	constructor(client, data, room, name) {
		/**
		 * The client that instantiated this action.
		 * @type {Client}
		 */
		this.client = client;
		/**
		 * The data from the server.
		 * @type {string}
		 */
		this.data = data;
		/**
		 * The room the action was sent in.
		 * @type {?Room}
		 */
		this.room = room;
		/**
		 * The action's name.
		 * @type {string}
		 */
		this.name = name;

		/**
		 * @typedef {Object} ActionResult
		 * @property {string} event The name of the event that was emitted.
		 * @property {Object} args The arguments the event ran with. Mapped by arg name.
		 */

		/**
		 * The results of the action if it has completed.
		 * @type {ActionResult[]}
		 */
		this.results = [];
	}

	/**
	 * Parse the data from the server into a readable format
	 * @returns {*}
	 */
	parse() {
		return this.data;
	}

	/**
	 * Execute the action
	 */
	run() {
		this.parse();
	}

	/**
	 * Removes the name from the start of this.data and returns it.
	 * @returns {string}
	 */
	removeMessageName() {
		const split = this.data.split('|');
		this.data = `|${split.splice(2).join('|')}`;
		return split[1];
	}

	/**
	 * Whether the action is to be run with a room.
	 * @returns {boolean}
	 */
	static get isRoomless() {
		return false;
	}

	/**
	 * Resolve the action.
	 * @param {string} event The name of the event.
	 * @param {Object} args The event arguments.
	 */
	resolve(event, args) {
		this.client.emit(event, ...Object.values(args));
		this.results.push({
			event,
			args,
		});
	}
}

module.exports = Action;
