const { MongoClient } = require('mongodb')

// MongoDB
const URI = `mongodb+srv://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_AUTH)}@${process.env.MONGO_HOST}?authSource=admin&retryWrites=true&w=majority`;

const client = new MongoClient(URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

client.connect((err) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.log('mongodb connected')
})

module.exports = client.db(process.env.MONGO_DB)