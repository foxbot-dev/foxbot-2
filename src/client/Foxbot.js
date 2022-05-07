const { Client, Intents } = require('discord.js');
const redisConnect = require('./redis.js');
const path = require('path');
const glob = require('fast-glob');
const BoltCollection = require('../collections/BoltCollection.js');
const ChainCollection = require('../collections/ChainCollection.js')

class Foxbot {
	constructor() {}

	async setup(rootRequire) {
		this.redis = await redisConnect();

		this.bolts = new BoltCollection(this);
		this.chains = new ChainCollection(this);

		// client
		this.client = new Client({
			intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'],
			allowedMentions: { parse: ['users'] },
		});

		(await glob(path.join(__dirname, '../events/*'))).forEach((r) => {
			const ev = require(r);
			this.client.on(ev.name, (...args) => ev(this, ...args));
		});

		this.chains.loadChains();

		this.client.login(process.env.BOT_TOKEN);
	}
}

module.exports = Foxbot;
