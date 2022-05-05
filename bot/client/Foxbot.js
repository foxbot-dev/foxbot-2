const { Client, Intents } = require('discord.js')
const { createClient } = require('redis')

class Foxbot {
	constructor() {
		this.client = new Client({
			intents: [
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_MEMBERS,
			],
			allowedMentions: { parse: ["users"] }
		})
	}

	get redis() {
		return this._redis
	}

	async setup(rootRequire) {
		this._redis = createClient()
	}
}

module.exports = Foxbot