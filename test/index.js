const Showdown = require('../src');

const client = new Showdown.Client({
	autoJoinRooms: ['lobby'],
	ws: {
		secure: false,
	},
});

client.on('ready', () => {
	console.log(`ps.js ${Showdown.version}: Client connected successfully`);
	client.joinRoom('lobby');
	client.globalRoom.leave();
});

client.on('raw', message => {
	console.log(message);
});

client.on('warn', console.error);

client.on('disconnect', () => {
	console.log(`ps.js ${Showdown.version}: Sockets closed`);
});
