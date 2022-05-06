const Chain = require('../../structures/Chain.js')
const commands = require('./commands')

class Foxbot extends Chain {
	constructor() {
		super()
		this.name = 'Foxbot'
		this.description = 'The core module of Foxbot'
		this.commands = commands
	}
}

module.exports = Foxbot