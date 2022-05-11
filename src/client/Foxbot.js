const { Client } = require('discord.js');
const redis = require('./redis.js');
const db = require('./db.js');
const path = require('path');
const glob = require('fast-glob');
const BoltCollection = require('../collections/BoltCollection.js');
const ChainCollection = require('../collections/ChainCollection.js');
const { Collection } = require('discord.js');
const config = require('../config/config.js');

class Foxbot {
	constructor() {}

	async setup() {
		this.redis = await redis.connect();
		this.db = db;

		this.bolts = new BoltCollection(this);
		this.chains = new ChainCollection(this);
		this.guilds = new Collection();
		this.users = new Collection();

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

	// #region Guilds
	async getGuildConfig(guildId) {
		let g = this.guilds.get(guildId)
		if (!g) {
			g = (await this.db.collection('guilds').findOne({
				id: guildId
			})) || {}
			this.guilds.set(guildId, g)
		}
		return g
	}

	async getPrefix(guildId) {
		const g = await this.getGuildConfig(guildId)
		return g.prefix || config.prefix
	}

	async setPrefix(guildId, prefix) {
		await this.db.collection('guilds').updateOne(
			{
				id: guildId,
			},
			{
				$set: {
					prefix,
				},
			},
			{
				upsert: true,
			}
		);
		await this.redis.publish('guildConfig', guildId);
	}
	// #endregion

	// #region Users
	async getUserConfig(userId) {
		let g = this.users.get(userId)
		if (!g) {
			g = (await this.db.collection('users').findOne({
				id: userId
			})) || {}
			this.users.set(userId, g)
		}
		return g
	}
	// #endregion
}

module.exports = Foxbot;
