const Action = require('./Action');
const { Events } = require('../util/Static');
const { toId } = require('../util');
const User = require('../classes/User');

/**
 * Action for the update user message.
 * @extends {Action}
 */
class ActionUpdateUser extends Action {
	constructor(client, data, room) {
		super(client, data, room, 'UPDATE_USER');
	}

	/**
	 * Execute the action
	 */
	run() {
		this.removeMessageName();
		const data = this.data.slice(1).split('|');

		const username = data[0];
		const id = toId(username);

		if (!this.client.user || id !== this.client.user.id) this._updateUsername(username, id, data[1] === '1');
		if (!this.client.user || data[3] !== this.client.user.avatar) this._updateAvatar(data[2]);
	}

	_updateUsername(username, id, loggedIn) {
		let user;
		if (this.client.users.has(id)) {
			user = this.client.users.get(id);
		} else {
			user = new User(this.client, {
				id: id,
				name: username,
			});
			this.client.users.set(id, user);
		}
		this.client.user = user;
		this.client.loggedIn = loggedIn;

		this.client.emit(Events.CLIENT_USERNAME_CHANGE, user, loggedIn);
	}

	_updateAvatar(avatar) {
		this.client.user.avatar = avatar;

		this.client.emit(Events.CLIENT_AVATAR_CHANGE, avatar);
	}
}

module.exports = ActionUpdateUser;

/**
 * Emitted when the challstr becomes available.
 * @event Client#challstr
 * @param {string} challstr The challstr.
 */
