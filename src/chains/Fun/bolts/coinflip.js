const Bolt = require('../../../structures/Bolt.js');
const colors = require('../../../constants/colors.js');
const coins = [
	'https://cdn.discordapp.com/attachments/835218270289788979/843190168906235985/tails-3.png',
	'https://cdn.discordapp.com/attachments/835218270289788979/843189728161038356/heads-3.png',
];

class coinflip extends Bolt {
	constructor(...args) {
		super(...args);
		this.name = 'coinflip';
		this.aliases = ['cf'];
	}

	/**
	 * @param {{ message: import('discord.js').Message, args: Array[string] }}}
	 */
	async execute({ message }) {
		await message.reply({
			embeds: [
				{
					title: 'Flipped Coin',
					image: {
						url: coins[Math.round(Math.random())],
					},
					color: colors.default,
				},
			],
		});
	}
}

module.exports = coinflip;
