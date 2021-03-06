const Action = require('./Action');
const { Events } = require('../util/Static');
const { toId } = require('../util');
const User = require('../classes/User');

class ActionUpdateUser extends Action {
	/**
	 * @hideconstructor
	 * @param {Client} client The client that instantiated this action.
	 * @param {string} data The data from the server.
	 * @param {?Room} room The room the action was performed in.
	 * @param {boolean} initMessage Whether the action is part of an init message.
	 */
	constructor(client, data, room) {
		super(client, data, room, 'UPDATE_USER');
	}

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

		this.resolve(Events.CLIENT_USERNAME_CHANGE, { user, loggedIn });
	}

	_updateAvatar(avatar) {
		this.client.user.avatar = avatar;

		this.resolve(Events.CLIENT_AVATAR_CHANGE, { avatar });
	}

	static isRoomless() {
		return true;
	}
}

module.exports = ActionUpdateUser;

/**
 * Emitted when the client username is changed.
 * @event Client#clientUsernameChange
 * @param {User} user The new client user.
 * @param {boolean} loggedIn Whether the client is logged in.
 */

/**
 * Emitted when the client avatar is changed.
 * @event Client#clientAvatarChange
 * @param {string} avatar The new avatar id.
 */
