/**
 * Options for a client.
 * @typedef {Object} ClientOptions
 * @property {String} [server=sim.smogon.com/showdown/websocket] URL of the web socket server to connect to
 * @property {String} [loginServer=play.pokemonshowdown.com/action.php] URL of the authentication server to use ()
 * @property {string[]} [autoJoinRooms=[]] Chat rooms to join automatically on connect
 * @property {WebsocketOptions} [ws] Options for the websocket
 * @property {HTTPOptions} [http] Options for http requests
 */
exports.DefaultOptions = {
	server: 'sim.smogon.com/showdown/websocket',
	loginServer: 'play.pokemonshowdown.com/action.php',
	autoJoinRooms: [],
	/**
	 * WebSocket options
	 * @typedef {Object} WebsocketOptions
	 * @property {boolean} [secure=true] Whether to use wss
	 */
	ws: {
		secure: true,
	},
	/**
	 * HTTP options
	 * @typedef {Object} HTTPOptions
	 * @property {boolean} [secure=true] Whether to use https
	 */
	http: {
		secure: true,
	},
};

exports.Events = {
	WARN: 'warn',
	DEBUG: 'debug',

	READY: 'ready',
	CHALLSTR: 'challstr',
	DISCONNECT: 'disconnect',
	RAW: 'raw',
	ROOM_INIT: 'roomInit',
	ROOM_DEINIT: 'roomDeinit',
	MESSAGE_SEND: 'message',
	DM_RECEIVED: 'dmReceived',
};
