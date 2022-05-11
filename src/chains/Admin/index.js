const Chain = require('../../structures/Chain.js')
const bolts = require('./bolts')

class Admin extends Chain {
	constructor() {
		super()
		this.name = 'Admin'
		this.description = 'The admin chain.'
		this.bolts = bolts
		this.hidden = true;
	}
}

module.exports = Admin