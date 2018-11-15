const Room = require('./Room');

/**
 * The default room on pokemon showdown
 * Does not have a chat like other rooms but can still receive commands
 * Standard place for messages that do not need a room
 * Refereed to by the server by omitting the room id
 * @extends {Room}
 */
class GlobalRoom extends Room {
	constructor(client) {
		super(client, {
			id: '',
			name: null,
			type: 'global',
		});

		this.joined = true;
	}
}

module.exports = GlobalRoom;
