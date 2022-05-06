const Foxbot = require('./client/Foxbot.js')
const logo = require('./constants/logo.js')

console.log(logo)

if (process.env.NODE_ENV == 'production') {
	
} else {
	require('longjohn')
}

const Bot = new Foxbot()

Bot.setup({  })