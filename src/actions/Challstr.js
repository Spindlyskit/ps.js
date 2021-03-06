const Action = require('./Action');
const { Events } = require('../util/Static');

class ActionChallstr extends Action {
	/**
	 * @hideconstructor
	 * @param {Client} client The client that instantiated this action.
	 * @param {string} data The data from the server.
	 * @param {?Room} room The room the action was performed in.
	 */
	constructor(client, data, room) {
		super(client, data, room, 'CHALLSTR');
	}

	run() {
		this.removeMessageName();
		const challstr = this.data.slice(1);
		this.client.challstr = challstr;
		this.resolve(Events.CHALLSTR, { challstr });
	}

	static isRoomless() {
		return true;
	}
}

module.exports = ActionChallstr;

/**
 * Emitted when the challstr becomes available.
 * @event Client#challstr
 * @param {string} challstr The challstr.
 */
