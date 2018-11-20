const Action = require('./Action');
const { Events } = require('../util/Static');

class ActionRoomUserList extends Action {
	/**
	 * @hideconstructor
	 * @param {Client} client The client that instantiated this action.
	 * @param {string} data The data from the server.
	 * @param {?Room} room The room the action was performed in.
	 * @param {boolean} initMessage Whether the action is part of an init message.
	 */
	constructor(client, data, room, initMessage) {
		super(client, data, room, initMessage, 'ROOM_USER_LIST');
	}

	/**
	 * Execute the action
	 */
	run() {
		this.removeMessageName();
		const userlistRAW = this.data.slice(1);
		const userlist = userlistRAW.split(',').splice(1);
		for (const nameString of userlist) {
			const user = this.client.users.getOrAdd(nameString);
			user.addRoom(this.room.id);
			this.client.users.set(user.id, user);
		}
		this.resolve(Events.ROOM_USER_UPDATE, { room: this.room, users: this.room.users });
	}
}

module.exports = ActionRoomUserList;

/**
 * Emitted when a room userlist becomes available.
 * <warn>Not emitted on user join or leave. See {@link client#roomUserJoin} and {@link client#roomUserLeave}
 * @event Client#roomUserUpdate
 * @param {Room} room The Room.
 * @param {UserStore} users The new userlist.
 */
