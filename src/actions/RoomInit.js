const Action = require('./Action');
const { Events } = require('../util/Static');

/**
 * Action for the room initialize message.
 * @extends {Action}
 */
class ActionRoomInit extends Action {
	constructor(client, data, room) {
		super(client, data, room, 'ROOM_INIT');
	}

	/**
	 * Execute the action
	 */
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
