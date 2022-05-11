/**
 * A "Gear" (module)
 */
class Chain {
	constructor(bot) {
		this.bolts = [];
		this.bot = bot;
		this.hidden = false;
		this._handlers = new Map();
	}

	init() {}
}

module.exports = Chain;
