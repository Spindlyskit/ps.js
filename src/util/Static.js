/**
 * Options for a client.
 * @typedef {Object} ClientOptions
 * @property {String} [server=sim.smogon.com/showdown/websocket] URL of the web socket server to connect to.
 * @property {String} [loginServer=play.pokemonshowdown.com/action.php] URL of the authentication server to use.
 * @property {string[]} [autoJoinRooms=[]] Chat rooms to join automatically on connect.
 * @property {boolean} [autoFetchRooms=true] Whether to automatically retrieve the names of all rooms on the server
 * and store them as uninitialized rooms.
 * @property {string} [lobby=lobby] The default room on the server
 * @property {number} [maxMessages=50] The max amount of chat messages stored in a room before old messages are deleted.
 * 0 for unlimited.
 * @property {WebsocketOptions} [ws] Options for the websocket.
 * @property {HTTPOptions} [http] Options for http requests.
 */
exports.DefaultOptions = {
	server: 'sim.smogon.com/showdown/websocket',
	loginServer: 'play.pokemonshowdown.com/action.php',
	autoJoinRooms: [],
	autoFetchRooms: true,
	lobby: 'lobby',
	maxMessages: 50,
	/**
	 * WebSocket options.
	 * @typedef {Object} WebsocketOptions
	 * @property {boolean} [secure=true] Whether to use wss.
	 */
	ws: {
		secure: true,
	},
	/**
	 * HTTP options.
	 * @typedef {Object} HTTPOptions
	 * @property {boolean} [secure=true] Whether to use https.
	 */
	http: {
		secure: true,
	},
};

/**
 * Options for awaiting actions..
 * @typedef {Object} ActionAwaitOptions
 * @property {function} [filter=() => true] Function to test messages against.
 * @property {number} [count=1] Max amount of actions to collect.
 * @property {number} [min_count=count] Minimum amount of actions to collect. Errors on timeout if this number
 * hasn't been reached
 * @property {number} [timeout=60000] Time in ms until the promise automatically ends regardless of messages collected.
 */
exports.actionAwaitDefaultOptions = {
	filter: () => true,
	count: 1,
	min_count: null,
	timeout: 60000,
};

/**
 * A users rank.
 * @typedef {Object} Rank
 * @property {String} name The name of the rank.
 * @property {String} id The id of the rank.
 * @property {String} name The rank's symbol.
 * @property {String} type The type of the rank. Either leadership, staff, normal, or punishment.
 * @property {Number} order The rank's sidebar position.
 */
exports.defaultRanks = [
	{
		name: 'Administrator',
		id: 'administrator',
		symbol: '~',
		type: 'leadership',
		order: 10001,
	},
	{
		name: 'Leader',
		id: 'leader',
		symbol: '&',
		type: 'leadership',
		order: 10002,
	},
	{
		name: 'Room Owner',
		id: 'roomowner',
		symbol: '#',
		type: 'leadership',
		order: 10003,
	},
	{
		name: 'Host',
		id: 'host',
		symbol: '\u2605',
		type: 'staff',
		order: 10004,
	},
	{
		name: 'Moderator',
		id: 'moderator',
		symbol: '@',
		type: 'staff',
		order: 10005,
	},
	{
		name: 'Driver',
		id: 'driver',
		symbol: '%',
		type: 'staff',
		order: 10006,
	},
	{
		name: 'Bot',
		id: 'bot',
		symbol: '*',
		type: 'normal',
		order: 10007,
	},
	{
		name: 'Player',
		id: 'player',
		symbol: '\u2606',
		type: 'normal',
		order: 10008,
	},
	{
		name: 'Voice',
		id: 'voice',
		symbol: '+',
		type: 'normal',
		order: 10009,
	},
	{
		name: 'Default',
		id: 'default',
		symbol: ' ',
		type: 'normal',
		order: 10010,
	},
	{
		name: 'Muted',
		id: 'muted',
		symbol: '!',
		type: 'punishment',
		order: 10011,
	},
	{
		name: 'Namelocked',
		id: 'namelocked',
		symbol: '\u2716',
		type: 'punishment',
		order: 10012,
	},
	{
		name: 'Locked',
		id: 'locked',
		symbol: '\u203d',
		type: 'punishment',
		order: 10013,
	},
];

exports.Events = {
	WARN: 'warn',
	DEBUG: 'debug',

	READY: 'ready',
	CHALLSTR: 'challstr',
	DISCONNECT: 'disconnect',
	RAW: 'raw',
	ACTIONRUN: 'actionRun',

	CHAT: 'chat',

	CLIENT_USERNAME_CHANGE: 'clientUsernameChange',
	CLIENT_AVATAR_CHANGE: 'clientAvatarChange',

	ROOM_INIT: 'roomInit',
	ROOM_TITLE: 'roomTitle',
	ROOM_USER_UPDATE: 'roomUserUpdate',
	ROOM_DEINIT: 'roomDeinit',
	ROOM_LOG_TEXT: 'roomLogMessage',

	USER_RENAME: 'userRename',
	USER_JOIN: 'userJoin',
	USER_LEAVE: 'userLeave',

	MESSAGE_SEND: 'message',
	DM_RECEIVED: 'dmReceived',
};
