const { Collection } = require('discord.js');
const glob = require('fast-glob');
const path = require('path');
const each = require('async-each');
const events = require('../constants/client-events.js');

/**
 * A "chain" (module collection)
 * @param Bot - An instance
 */
class ChainCollection extends Collection {
	constructor(/** @type {import('../client/Foxbot.js')} */ foxbot) {
		super();

		this.bot = foxbot;
	}

	async loadChains() {
		await each(await glob(path.join(__dirname, '../chains/*/index.js')), (chain, next) => {
			this.registerChain(require(chain));
			return next();
		});
	}

	async registerChain(cls) {
		const chain = new cls(this.bot);

		if (!!chain.bolts.length) {
			chain.bolts.forEach((r) => this.bot.bolts.registerBolt(r, chain));
		}

		await chain.init(this.bot);

		// events
		events
			.filter((r) => chain[r])
			.forEach((r) => {
				const f = chain[r].bind(chain)
				this.bot.client.on(r, f);
				chain._handlers.set(r, f);
				console.log(`Registered event handler [${r}] for chain ${chain.name}`);
			});

		this.set(chain.name, chain);
		console.log(
			`Chain [${chain.name}] loaded with [${chain.bolts.length}] ${chain.bolts.length == 1 ? 'bolt' : 'bolts'}`
		);
	}

	async unregisterChain(cls) {}
}

module.exports = ChainCollection;
