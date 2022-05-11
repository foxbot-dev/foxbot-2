const { createClient } = require('redis');

async function connect() {
	const client = createClient({
		url: process.env.REDIS_HOST,
	});

	const onReject = (err) => console.error(err);

	client.once('error', onReject);

	const wait = new Promise((res) => {
		client.once('ready', () => {
			client.removeListener('error', onReject);
			console.log('Connected to redis');
			res(true);
		});
	});

	client.connect();
	await wait;
	return client;
};

module.exports = {
	connect
}