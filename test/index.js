const Showdown = require('../src');

const client = new Showdown.Client({
	autoJoinRooms: ['lobby'],
	ws: {
		secure: false,
	},
});

client.on('ready', () => {
	console.log(`ps.js ${Showdown.version}: Client connected successfully`);
	client.rooms.tryJoin('lobby');
});

client.on('challstr', () => {
	console.log('client login ready');
	client.login('eqobot', 'test123');
});

// client.on('raw', console.log);


client.on('warn', console.warn);

client.on('disconnect', () => {
	console.log(`ps.js ${Showdown.version}: Sockets closed`);
});

client.on('roomInit', (room) => {
	console.log(`${room.id} initialized`);
});

client.on('clientUsernameChange', (user, loggedIn) => {
	if (!loggedIn) return;
	console.log(`Logged in as ${user.name}!`);
});

client.on('clientAvatarChange', (avatar) => {
	console.log(`Avatar is now ${avatar}!`);
});
