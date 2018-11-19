const { toId } = require('../util');
const { actionAwaitDefaultOptions, Events } = require('../util/Static');
const ActionManager = require('../actions/ActionManager');
const actionManager = new ActionManager();

/**
 * Parses incoming data.
 */
class MessageHandler {
	constructor(client) {
		/**
		 * The client that instantiated this MessageHandler.
		 * @type {Client}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * All items that listen for messages on the handler
		 * @type {Map<number, function>}
		 */
		this.collectors = new Map();

		/**
		 * The current collector id
		 * @type {number}
		 * @private
		 */
		this._collectorID = 0;
	}

	/**
	 * Parse and run a message from the server.
	 * @param {string} message The message to parse
	 */
	parseExec(message) {
		const actions = message.split('\n');
		let room;
		// If the first line starts with `>`, remove the line and set the room
		if (actions[0].startsWith('>')) room = this.parseRoomLine(actions.shift());
		else room = this.client.rooms.lobby;

		for (const act of actions) {
			if (!act.startsWith('|') || act.startsWith('||')) {
				this.client.emit(Events.ROOM_LOG_TEXT, room, act);
			} else {
				const action = this.parseAct(act, room);
				action.run();

				this.client.emit(Events.ACTIONRUN, action);
				this.collectors.forEach(e => e(action));
			}
		}
	}

	/**
	 * Parse the top line of a message that tells us the room to use. Not called every message as the line may be omitted.
	 * @param {string} line The room line to parse (must start with `>`)
	 * @returns {?Room}
	 */
	parseRoomLine(line) {
		if (!line.startsWith('>')) {
			this.client.warn(`Invalid room line in message - ${line}`);
			return null;
		}
		const room = toId(line.substr(1));

		return this.client.rooms.getOrAdd(room);
	}

	/**
	 * Parse a normal action line from the message body.
	 * @param {string} act The action line to parse.
	 * @param {Room} room The room the action was executed in.
	 * @returns {Action} The resulting action
	 */
	parseAct(act, room) {
		const actionName = act.split('|')[1];

		let Action;
		if (actionManager.has(actionName)) Action = actionManager.get(actionName);
		else Action = actionManager.default;
		return new Action(this.client, act, Action.isRoomless ? null : room);
	}

	/**
	 * Returns a promise that resolves when actions matching the criteria are received.
	 * Actions may not be resolved when collected.
	 * @param {ActionAwaitOptions} options The options for the query
	 * @returns {Promise<Action[]>}
	 */
	awaitActions(options) {
		options = Object.assign(actionAwaitDefaultOptions, options);
		if (!options.min_count) options.min_count = options.count;
		const id = this._collectorID++;

		return new Promise((resolve, reject) => {
			const collected = [];

			setTimeout(() => {
				this.collectors.delete(id);
				if (collected.length >= options.min_count) resolve(collected);
				else reject(new Error('Timed out'));
			}, options.timeout);

			this.collectors.set(id, action => {
				if (options.filter(action)) collected.push(action);

				if (collected.length >= options.count) {
					this.collectors.delete(id);
					resolve(collected);
				}
			});
		});
	}
}

module.exports = MessageHandler;

/**
 * Emitted when an action is run.
 * @event Client#actionRun
 * @param {Action} action The action that was run
 */

/**
 * Emitted when text is recieved from the server to be displayed directly in the room log.
 * @event Client#roomLogMessage
 * @param {Room} room The room the message was sent in.
 * @param {string} message The message to be displayed.
 */
