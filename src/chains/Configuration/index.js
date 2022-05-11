const Chain = require('../../structures/Chain.js')
const bolts = require('./bolts')

class Configuration extends Chain {
	constructor() {
		super()
		this.name = 'Configuration'
		this.description = 'The config chain.'
		this.bolts = bolts
	}
}

module.exports = Configuration