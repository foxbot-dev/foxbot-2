const Chain = require('../../structures/Chain.js')
const bolts = require('./bolts')

class Foxbot extends Chain {
	constructor() {
		super()
		this.name = 'Foxbot'
		this.description = 'The core module of Foxbot'
		this.bolts = bolts
	}
}

module.exports = Foxbot