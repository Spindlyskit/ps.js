const Collection = require('../util/Collection');

class ActionManager {
	/**
	 * @hideconstructor
	 */
	constructor() {
		this.actions = new Collection();
		this.register(require('./RoomInit'), 'init');
		this.register(require('./RoomTitle'), 'title');
		this.register(require('./RoomUserList'), 'users');
		this.register(require('./Challstr'), 'challstr');
		this.register(require('./UpdateUser'), 'updateuser');
		this.default = require('./Action');
		this.aliases = {};
	}

	get(action) {
		if (this.aliases.hasOwnProperty(action)) action = this.aliases[action];
		return this.actions.get(action);
	}

	has(action) {
		if (this.aliases.hasOwnProperty(action)) return true;
		return this.actions.has(action);
	}

	register(action, ...messages) {
		this.actions.set(messages[0], action);
		for (const i of messages.splice(1)) {
			this.alias(messages[0], i);
		}
	}

	alias(base, alias) {
		this.aliases[alias] = base;
	}
}

module.exports = ActionManager;
