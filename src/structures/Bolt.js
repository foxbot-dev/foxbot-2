/**
 * A "bolt" (command)
 */
class Bolt {
	constructor(/** @type {import('../client/Foxbot.js')} */ bot, chain) {
		this.bot = bot
		this.chain = chain
		this.guildOnly = false
		this.dmOnly = false
		this._handlers = new Map()
	}

	execute() {}
}

module.exports = Bolt