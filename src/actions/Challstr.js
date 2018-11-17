const Action = require('./Action');
const { Events } = require('../util/Static');

/**
 * Action for the challstr message.
 * @extends {Action}
 */
class ActionChallstr extends Action {
	constructor(client, data, room) {
		super(client, data, room, 'CHALLSTR');
	}

	/**
	 * Execute the action
	 */
	run() {
		this.removeMessageName();
		const challstr = this.data.slice(1);
		this.client.challstr = challstr;
		this.client.emit(Events.CHALLSTR, challstr);
	}
}

module.exports = ActionChallstr;

/**
 * Emitted when the challstr becomes available.
 * @event Client#challstr
 * @param {string} challstr The challstr.
 */
