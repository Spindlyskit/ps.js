const Showdown = require('../src');

const client = new Showdown.BaseClient({
	ws: {
		secure: false,
	},
});

console.log(Showdown.version);
