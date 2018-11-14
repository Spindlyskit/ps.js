/**
 * Used for handling websocket events
 * @private
 */
class Action {
	constructor(client) {
		this.client = client;
	}

	run(data) {
		return data;
	}
}

module.exports = Action;
