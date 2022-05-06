const { Collection } = require('discord.js');
const { Client, Intents } = require('discord.js');
const redis = require('./redis.js');
const path = require('path')
const glob = require('fast-glob')
const BoltCollection = require('../collections/BoltCollection.js');
const ChainCollection = require('../collections/ChainCollection.js');

class Foxbot {
	constructor() {
	}

	get redis() {
		return this._redis;
	}

	get client() {
		return this._client
	}

	async setup(rootRequire) {
		this._redis = await redis.connect();
		
		this.bolts = new BoltCollection(this)
		this.chains = new ChainCollection(this)

		// events
		this._handlers = new Collection()

		// client
		this._client = new Client({
			intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'],
			allowedMentions: { parse: ['users'] },
		});

		(await glob(path.join(__dirname, '../events/*'))).forEach(r => {
			const ev = require(r)
			this._client.on(ev.name, (...args) => ev(this, ...args))
		})

		this.chains.loadChains()

		this.client.login(process.env.BOT_TOKEN)
	}
}

module.exports = Foxbot;
