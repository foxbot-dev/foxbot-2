const Chain = require('../../structures/Chain.js')

class GuildConfig extends Chain {
	constructor() {
		super()
		this.name = 'GuildConfig'
		this.description = 'GuildConfig'
		this.hidden = true
	}

	/**
	 * 
	 * @param {import('../../client/Foxbot.js')} bot 
	 */
	async init(bot) {
		const sub = bot.redis.duplicate()

		await sub.connect()

		await sub.subscribe('guildConfig', async m => {
			const doc = await bot.db.collection('guilds').findOne({
				id: m
			}) || {}
			bot.guilds.set(m, doc)
			console.debug(`Updated internal guild config for ${m}`)
		})
	}
}

module.exports = GuildConfig