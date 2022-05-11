const fs = require('fs')
const path = require('path')
const { prefix } = require('../src/config/config')

const data = {}

console.log('Exporting commands')

const chains = fs.readdirSync(path.join(__dirname, '../src/chains'))

console.log(`Found ${chains.length} chains`)

chains.forEach(r => {
	const chain = require('../src/chains/' + r)
	const cont = new chain
	if (!cont.bolts.length || cont.hidden) {
		return console.log(`Skipping chain ${cont.name}`)
	} else {
		data[cont.name] = []
	}
	console.log(`Creating data for ${cont.bolts.length} bolts`)
	cont.bolts.forEach(b => {
		const blt = new b()
		const ob = {
			name: blt.name,
			description: blt.description,
			usage: `${prefix}${blt.name} ${blt.usage}`
		}
		data[cont.name].push(ob)
	})
})

fs.writeFileSync(path.join(__dirname, '/commands.json'), JSON.stringify(data))
console.log(`Done.`)