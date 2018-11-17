module.exports = {
	/**
	 * Check if a given value is an object.
	 * @param {Object} d The value to check.
	 * @returns {boolean}
	 */
	isObject: d => typeof d === 'object' && d !== null,
	/**
	 * Converts anything to an ID. An ID must have only lowercase alphanumeric
	 * characters.
	 * If a string is passed, it will be converted to lowercase and
	 * non-alphanumeric characters will be stripped.
	 * If an object with an ID is passed, its ID will be returned.
	 * Otherwise, an empty string will be returned.
	 *
	 * @param {*} text The text to turn into an id
	 * @returns {string}
	 */
	toId: function toId(text) {
		if (text && text.id) {
			text = text.id;
		}
		if (typeof text !== 'string' && typeof text !== 'number') return '';
		return `${text}`.toLowerCase().replace(/[^a-z0-9]+/g, '');
	},
};
