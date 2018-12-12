const Action = require('./Action');
const { Events } = require('../util/Static');

class ActionRoomTitle extends Action {
	/**
	 * @hideconstructor
	 * @param {Client} client The client that instantiated this action.
	 * @param {string} data The data from the server.
	 * @param {?Room} room The room the action was performed in.
	 * @param {boolean} initMessage Whether the action is part of an init message.
	 */
	constructor(client, data, room) {
		super(client, data, room, 'ROOM_TITLE');
	}

	run() {
		this.removeMessageName();
		const roomName = this.data.slice(1);
		this.room.name = roomName;
		this.resolve(Events.ROOM_TITLE, { room: this.room, roomTitle: roomName });
	}
}

module.exports = ActionRoomTitle;

/**
 * Emitted when a room title becomes available.
 * @event Client#roomTitle
 * @param {Room} room The Room that was named.
 * @param {string} roomName The name of the room.
 */
