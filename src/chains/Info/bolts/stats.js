const { MessageEmbed } = require('discord.js');
const Bolt = require('../../../structures/Bolt.js');
const ms = require('pretty-ms');
const colors = require('../../../constants/colors.js');

class stats extends Bolt {
	constructor(...args) {
		super(...args);
		this.name = 'stats';
		this.aliases = ['info', 'statistics'];
		this.description = 'Get some statistics of Foxbot'
	}

	/**
	 * @param {{ message: import('discord.js').Message, args: Array[string] }}}
	 */
	async execute({ message, args }) {
		await message.channel.send({
			embeds: [
				new MessageEmbed({
					title: 'Foxbot Statistics',
					fields: [
						{
							name: 'Guilds',
							value: '`' + this.bot.client.guilds.cache.size + '`',
							inline: true,
						},
						{
							name: 'Uptime',
							value: '`' + ms(this.bot.client.uptime) + '`',
							inline: true,
						},
					],
					color: colors.default,
				}),
			],
		});
	}
}

module.exports = stats;
