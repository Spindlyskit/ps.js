const DataStore = require('./DataStore');
const Room = require('../classes/Room');

class RoomStore extends DataStore {
	constructor(client, iterable) {
		super(client, Room, iterable);
	}

	/**
	 * Data that resolves to give a Room object. This can be:
	 * * A Room object
	 * * A String (room id)
	 * @typedef {Room|string} RoomResolvable
	 */

	/**
	 * Resolves a RoomResolvable to a Room object.
	 * @method resolve
	 * @memberof RoomStore
	 * @instance
	 * @param {RoomResolvable} room The room resolvable to identify
	 * @returns {?Room}
	 */

	/**
	 * Join a room not in the store by id
	 * @param {string} roomid The id of the room to join
	 */
	tryJoin(roomid) {
		this.client.sendToGlobal(`/join ${roomid}`);
	}

	/**
	 * Get a room if it exists in the store, else create it as an uninitialized room.
	 * <warn>This should only be used if the id is confirmed to be a room since a new room class is created
	 * @param {string} room - The room id to create
	 * @returns {Room}
	 */
	getOrAdd(room) {
		if (this.has(room)) {
			return this.get(room);
		} else {
			const uninitRoom = new Room(this.client, {
				id: room,
			});
			this.set(room, uninitRoom);
			return uninitRoom;
		}
	}


	/**
	 * The main room on the server.
	 * @value {Room}
	 */
	get lobby() {
		return this.get(this.client.options.lobby);
	}

	set lobby(value) {
		if (typeof value === 'string') {
			this.client.options.lobby = value;
		} else {
			this.client.options.lobby = value.id;
		}
	}
}

module.exports = RoomStore;
