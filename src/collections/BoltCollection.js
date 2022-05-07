const { Collection } = require('discord.js');
const events = require('../constants/client-events.js')

/**
 * A "bolt" collection (command collection)
 * @param Bot - An instance
 */
class BoltCollection extends Collection {
	constructor(foxbot) {
		super();

		this.bot = foxbot;
	}

	async registerBolt(b, chain) {
		const bolt = new b(this.bot, chain);

		// validate
		const props = ['name', 'chain', 'bot'].filter((r) => !bolt[r]);
		if (props.length) {
			throw new Error(`Invalid bolt ${bolt.name}, missing props: ${props}`);
		}

		if (bolt.aliases) {
			for (let alias of bolt.aliases) {
				this.set(alias, bolt);
			}
		}

		// events
		events
			.filter((r) => bolt[r])
			.forEach((r) => {
				const f = bolt[r].bind(bolt)
				this.bot.client.on(r, f);
				bolt._handlers.set(r, f);
				console.log(`Registered event handler [${r}] for bolt ${bolt.name}`);
			});

		this.set(bolt.name, bolt);
		return true;
	}
}

module.exports = BoltCollection;
