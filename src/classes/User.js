const { toId } = require('../util');
const RoomStore = require('../datastores/RoomStore');
const Room = require('./Room');

/**
 * Represents any user on showdown
 */
class User {
	constructor(client, data) {
		/**
		 * The client that instantiated this user
		 * @type {Client}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The ids of all the rooms the user is in.
		 * @type {Set<string>}
		 * @private
		 */
		this._rooms = new Set();

		/**
		 * Cached RoomStore
		 * @type {?RoomStore}
		 * @private
		 */
		this._roomCache = null;

		if (data.nameString) return this._fromNameString(data.nameString);

		/**
		 * The unique ID of the user
		 * Used to target the user in commands
		 * @type {string}
		 */
		this.id = data.id;

		/**
		 * The name of the user. Null if from a source such as user lookup as we are not given the name.
		 * @type {?string}
		 */
		this.name = data.name || null;

		/**
		 * The rank of the user.
		 * @type {?Rank}
		 */
		this.rank = data.rank || null;

		/**
		 * The avatar of the user.
		 * @type {?string}
		 */
		this.avatar = data.avatar || null;
	}

	/**
	 * Sets the users properties from a string in the format of {ranksymbol}{name} (commonly sent from the server)
	 * @param {string} nameString The data string from the server
	 * @private
	 */
	_fromNameString(nameString) {
		this.rank = this.client.ranks.find(e => e.symbol === nameString.charAt(0));
		this.name = nameString.substr(1);
		this.id = toId(this.name);
	}

	addRoom(roomId) {
		if (this._rooms.has(roomId)) return;
		if (!this.client.rooms.has(roomId)) this.client.rooms.getOrAdd(roomId);
		this._roomCache = null;
		this._rooms.add(roomId);
	}

	/**
	 * Check if the user is in the given room.
	 * @param {Room|string} room The room to check.
	 * @returns {boolean}
	 */
	isInRoom(room) {
		if (room instanceof Room) room = room.id;
		return this._rooms.has(room);
	}

	/**
	 * All rooms the user is in
	 * @returns {?RoomStore}
	 */
	get rooms() {
		if (this._roomCache) return this._roomCache;
		this._roomCache = new RoomStore(this.client, this.client.rooms.filter(e => this._rooms.has(e.id)));
		return this._roomCache;
	}
}

module.exports = User;
