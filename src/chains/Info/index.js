const Chain = require('../../structures/Chain.js')
const bolts = require('./bolts')

class Info extends Chain {
	constructor() {
		super()
		this.name = 'Info'
		this.description = 'The informational module of Foxbot'
		this.bolts = bolts
	}
}

module.exports = Info