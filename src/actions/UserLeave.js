const Action = require('./Action');
const { Events } = require('../util/Static');

class ActionUserLeave extends Action {
	/**
	 * @hideconstructor
	 * @param {Client} client The client that instantiated this action.
	 * @param {string} data The data from the server.
	 * @param {?Room} room The room the action was performed in.
	 * @param {boolean} initMessage Whether the action is part of an init message.
	 */
	constructor(client, data, room, initMessage) {
		super(client, data, room, initMessage, 'USER_LEAVE');
	}

	/**
	 * Execute the action
	 */
	run() {
		const displayInline = this.removeMessageName() !== 'L';
		const nameString = this.data.slice(1);
		const user = this.client.users.getOrAdd(nameString);

		user.removeRoom(this.room.id);

		this.resolve(Events.USER_LEAVE, { user, room: this.room, displayInline });
	}
}

module.exports = ActionUserLeave;

/**
 * Emitted when a user leaves a room.
 * @event Client#userLeave
 * @param {User} user The user that left.
 * @param {Room} room The room they left.
 * @param {boolean} displayInline Whether the event should display inline.
 */
