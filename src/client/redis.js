const { createClient } = require('redis')

async function connect() {
	const client = createClient({
		url: process.env.REDIS_HOST
	})

	const onReject = err => console.error(err)

	client.once('error', onReject)

	client.on('ready', () => {
		client.removeListener('error', onReject)
		console.log('Connected to redis')
		return true
	})

	client.connect()
}

module.exports = { connect }