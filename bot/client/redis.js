const redis = require('redis')

async function connect() {
	const client = redis.connect()

	const onReject = err => console.error

	client.once('error', onReject)

	client.on('ready', () => {
		client.removeListener('once', onReject)
	})
}