const Action = require('./Action');
const { Events } = require('../util/Static');

class ActionRoomInit extends Action {
	/**
	 * @hideconstructor
	 * @param {Client} client The client that instantiated this action.
	 * @param {string} data The data from the server.
	 * @param {?Room} room The room the action was performed in.
	 */
	constructor(client, data, room) {
		super(client, data, room, 'ROOM_INIT');
	}

	run() {
		this.removeMessageName();
		const roomType = this.data.slice(1);
		this.room.init(roomType);
		this.client.emit(Events.ROOM_INIT, this.room, roomType);
	}
}

module.exports = ActionRoomInit;

/**
 * Emitted when a room is initialized.
 * @event Client#roomInit
 * @param {Room} room The Room that was initialized.
 * @param {string} roomType The type of the room that was initialized.
 */
