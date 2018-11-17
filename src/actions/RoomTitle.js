const Action = require('./Action');
const { Events } = require('../util/Static');

/**
 * Action for the room title message.
 * @extends {Action}
 */
class ActionRoomTitle extends Action {
	constructor(client, data, room) {
		super(client, data, room, 'ROOM_TITLE');
	}

	/**
	 * Execute the action
	 */
	run() {
		this.removeMessageName();
		const roomTitle = this.data.slice(1);
		this.room.title = roomTitle;
		this.client.emit(Events.ROOM_TITLE, this.room, roomTitle);
	}
}

module.exports = ActionRoomTitle;

/**
 * Emitted when a room title becomes available.
 * @event Client#roomTitle
 * @param {Room} room The Room that was named.
 * @param {string} roomName The name of the room.
 */
