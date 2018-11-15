// Used for handling websocket events
class Action {
	constructor(client) {
		this.client = client;
	}

	run(data) {
		return data;
	}
}

module.exports = Action;
