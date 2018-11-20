class Message {
	constructor(client, data) {
		/**
		 * The client that instantiated this message.
		 * @type {Client}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The user that sent the message.
		 * @type {User}
		 */
		this.author = data.user;

		/**
		 * The message body.
		 * @type {string}
		 */
		this.content = data.content;

		/**
		 * The room the message was sent in.
		 * @type {Room}
		 */
		this.room = data.room;

		/**
		 * The message timestamp, if the server sent one.
		 * @type {?timestamp}
		 */
		this.timestamp = data.timestamp || null;
	}
}

module.exports = Message;
