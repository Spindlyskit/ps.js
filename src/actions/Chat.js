const Action = require('./Action');
const { Events } = require('../util/Static');
const Message = require('../classes/Message');

class ActionChat extends Action {
	/**
	 * @hideconstructor
	 * @param {Client} client The client that instantiated this action.
	 * @param {string} data The data from the server.
	 * @param {?Room} room The room the action was performed in.
	 * @param {boolean} initMessage Whether the action is part of an init message.
	 */
	constructor(client, data, room) {
		super(client, data, room, 'CHAT');
	}

	run(actions) {
		const room = this.room;
		const hasTimestamp = this.removeMessageName() === 'c:' ? 1 : 0;
		const messageData = this.data.slice(1).split('|');
		const timestamp = hasTimestamp === 1 ? messageData[0] : null;

		const user = this.client.users.getOrAdd(messageData[hasTimestamp]);
		const content = messageData[hasTimestamp + 1];

		const isInit = !!actions.find(action => action.name === 'ROOM_INIT');

		const message = new Message(this.client, { user, timestamp, content, room, isInit });

		this.room.messages.add(message);
		if (room.messages.size !== 0 && room.messages.size === this.client.options.maxMessages) {
			room.messages.delete(room.messages.values().next());
		}

		if (!isInit) this.resolve(Events.CHAT, { message, room: this.room });
		else this.silentResolve(Events.CHAT, { message, room: this.room });
	}
}

module.exports = ActionChat;

/**
 * Emitted a chat message is received.
 * @event Client#chat
 * @param {Message} The message that was received.
 * @param {Room} room The room the message was send in.
 */
