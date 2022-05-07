const Chain = require('../../structures/Chain.js')
const bolts = require('./bolts')

class Fun extends Chain {
	constructor() {
		super()
		this.name = 'Fun'
		this.description = 'Commands that may not be so useful, but fun'
		this.bolts = bolts
	}
}

module.exports = Fun