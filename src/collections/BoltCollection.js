const { Collection } = require('discord.js');

/**
 * A "bolt" collection (command collection)
 * @param Bot - An instance
 */
class BoltCollection extends Collection {
	constructor(foxbot) {
		super();

		this.bot = foxbot;
	}

	async registerBolt(b) {
		const bolt = new b();

		if (bolt.aliases) {
			for (let alias of bolt.aliases) {
				this.set(alias, bolt);
			}
		}

		this.set(bolt.name, bolt);
	}
}

module.exports = BoltCollection;
