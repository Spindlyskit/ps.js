const Action = require('./Action');
const { Events } = require('../util/Static');
const { toId } = require('../util');

class ActionUserRename extends Action {
	/**
	 * @hideconstructor
	 * @param {Client} client The client that instantiated this action.
	 * @param {string} data The data from the server.
	 * @param {?Room} room The room the action was performed in.
	 * @param {boolean} initMessage Whether the action is part of an init message.
	 */
	constructor(client, data, room) {
		super(client, data, room, 'USER_RENAME');
	}

	run() {
		const displayInline = this.removeMessageName() !== 'N';

		const userData = this.data.slice(1).split('|');
		const newName = userData[0];
		const oldId = userData[1];
		const user = this.client.users.getOrAdd(oldId);
		const oldName = user.name || oldId;

		if (!user.rooms.has(this.room.id)) user.addRoom(this.room.id);
		this.client.users.delete(oldId);
		this.client.users.set(toId(newName), user);

		user.name = newName;
		user.id = toId(newName);

		this.resolve(Events.USER_RENAME, { user, name: newName, oldName, displayInline });
	}
}

module.exports = ActionUserRename;

/**
 * Emitted when a user changes name.
 * @event Client#userRename
 * @param {User} user The user who changed name.
 * @param {string} newName The user's new name.
 * @param {string} oldName The user's old name.
 * @param {boolean} displayInline Whether the event should display inline.
 */
