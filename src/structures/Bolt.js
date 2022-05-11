/**
 * A "bolt" (command)
 */
class Bolt {
	constructor(/** @type {import('../client/Foxbot.js')} */ bot, chain) {
		this.bot = bot
		this.chain = chain
		this.guildOnly = false
		this.dmOnly = false
		this.usage = ''
		this.description = 'Command has no description.'
		this._handlers = new Map()
	}

	execute() {}
}

module.exports = Bolt