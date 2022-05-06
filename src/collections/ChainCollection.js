const { Collection } = require("discord.js");
const glob = require('fast-glob')
const path = require('path')
const each = require('async-each')

/**
 * A "chain" (module collection)
 * @param Bot - An instance
 */
class ChainCollection extends Collection {
	constructor(foxbot) {
		super();

		this.bot = foxbot
	}

	async loadChains() {
		await each(await glob(path.join(__dirname, '../modules/*/index.js')), (chain, next) => {
			this.registerChain(require(chain))
			return next()
		})
	}

	async registerChain(cls) {
		const chain = new cls()
		
		if (chain.commands) {
			chain.commands.forEach(r => this.bot.bolts.registerBolt(r))
		}

		this.set(chain.name, chain)
		console.log(`Chain [${chain.name}] loaded with [${chain.commands.length}] bolts`)
	}
}

module.exports = ChainCollection