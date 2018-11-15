// Exports classes and methods

module.exports = {
	// Entry classes
	BaseClient: require('./client/BaseClient'),
	Client: require('./client/Client'),

	// Utility Classes
	Collection: require('./util/Collection'),

	// Metadata
	version: require('../package.json').version,
};
