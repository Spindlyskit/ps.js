const Showdown = require('../src');
const { username, password } = require('./auth.secret');

const client = new Showdown.Client({
	autoJoinRooms: ['lobby'],
	ws: {
		secure: false,
	},
});

client.on('ready', () => {
	console.log(`ps.js ${Showdown.version}: Client connected successfully`);
});

client.on('challstr', () => {
	console.log('client login ready');
	client.login(username, password);
});

client.on('chat', (message, room) => {
	console.log(`${room.name}@${message.timestamp ? message.timestamp : 'unknown'} >${message.author.nameString}: ${message.content}`);
	if (!message.isInit && Showdown.toId(message.content) === 'hey') {
		room.send(`Hey ${message.author.name}!`);
	}
});

client.on('warn', console.warn);

client.on('disconnect', () => {
	console.log(`ps.js ${Showdown.version}: Sockets closed`);
});

client.on('roomInit', (room) => {
	console.log(`${room.id} initialized`);
});

client.on('clientUsernameChange', (user, loggedIn) => {
	if (!loggedIn) return;
	client.rooms.tryJoin('lobby');
	console.log(`Logged in as ${user.name}!`);
});

client.on('clientAvatarChange', (avatar) => {
	console.log(`Avatar is now ${avatar}!`);
});
