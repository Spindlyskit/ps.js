const Collection = require('../util/Collection');

/**
 * Stores information about a specific type of object
 * @extends {Collection}
 */
class DataStore extends Collection {
	/**
	 * @param {Client} client The client that instantiated this DataStore
	 * @param {*} store The type of object the store holds
	 * @param {*} [iterable=null] The iterable to base this store off.
	 */
	constructor(client, store, iterable = null) {
		super(iterable);

		/**
		 * The client that instantiated this DataStore
		 * @type {Client}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });
		/**
		 * The type of object the store holds
		 * @type {*}
		 * @readonly
		 */
		Object.defineProperty(this, 'store', { value: store });
	}

	/**
	 * Resolves a data entry to a data Object.
	 * @param {string|Object} instance The id or instance of something in this DataStore
	 * @returns {?Object} An instance from this DataStore
	 */
	resolve(instance) {
		if (instance instanceof this.store) return instance;
		if (typeof instance === 'string') return this.get(instance) || null;
		return null;
	}
}

module.exports = DataStore;
