const { toId } = require('../util');
const DataStore = require('./DataStore');
const User = require('../classes/User');

class UserStore extends DataStore {
	constructor(client, iterable) {
		super(client, User, iterable);
	}

	/**
	 * Data that resolves to give a User object. This can be:
	 * * A User object
	 * * A String (user id or user name string)
	 * @typedef {Room|string} UserResolvable
	 */

	/**
	 * Resolves a UserResolvable to a User object.
	 * @param {RoomResolvable} user The user resolvable to identify
	 * @returns {?User}
	 */
	resolve(user) {
		if (user instanceof User) return user;
		if (typeof user === 'string') return this.get(toId(user)) || null;
		return null;
	}

	/**
	 * Get a user if it exists in the store, else create it from name string.
	 * <warn>This should only be used if the name string is confirmed to be a user since a new user instance is created
	 * @param {string} nameString - The username to create
	 * @returns {User}
	 */
	getOrAdd(nameString) {
		if (this.has(toId(nameString))) {
			return this.get(toId(nameString));
		} else {
			const newUser = new User(this.client, { nameString });
			this.set(toId(nameString), newUser);
			return newUser;
		}
	}
}

module.exports = UserStore;
