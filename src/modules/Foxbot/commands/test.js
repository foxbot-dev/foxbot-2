const Bolt = require('../../../structures/Bolt.js')

class test extends Bolt {
	constructor(...args) {
		super(...args)
		this.name = 'test'
		this.aliases = ['tt']
	}

	execute({ message, args }) {}
}

module.exports = test