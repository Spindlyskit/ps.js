const Action = require('./Action');
const { Events } = require('../util/Static');

class ActionUserJoin extends Action {
	/**
	 * @hideconstructor
	 * @param {Client} client The client that instantiated this action.
	 * @param {string} data The data from the server.
	 * @param {?Room} room The room the action was performed in.
	 * @param {boolean} initMessage Whether the action is part of an init message.
	 */
	constructor(client, data, room, initMessage) {
		super(client, data, room, initMessage, 'USER_JOIN');
	}

	/**
	 * Execute the action
	 */
	run() {
		const displayInline = this.removeMessageName() !== 'J';
		const nameString = this.data.slice(1);
		const user = this.client.users.getOrAdd(nameString);

		user.addRoom(this.room.id);

		this.resolve(Events.USER_JOIN, { user, room: this.room, displayInline });
	}
}

module.exports = ActionUserJoin;

/**
 * Emitted when a user joins a room.
 * @event Client#userJoin
 * @param {User} user The user that joined.
 * @param {Room} room The room they joined.
 * @param {boolean} displayInline Whether the event should display inline.
 */
