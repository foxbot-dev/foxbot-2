const { MessageEmbed } = require('discord.js');
const Foxbot = require('../../../client/Foxbot.js');
const Bolt = require('../../../structures/Bolt.js');
const ms = require('pretty-ms');
const colors = require('../../../constants/colors.js');

class stats extends Bolt {
	constructor(...args) {
		super(...args);
		this.name = 'stats';
		this.aliases = ['info', 'statistics'];
		this.chain = 'Foxbot';
	}

	/**
	 * @param {{ bot: Foxbot, message: import('discord.js').Message, args: Array[string] }}}
	 */
	async execute({ bot, message, args }) {
		await message.channel.send({
			embeds: [
				new MessageEmbed({
					title: 'Foxbot Statistics',
					fields: [
						{
							name: 'Guilds',
							value: '`' + bot.client.guilds.cache.size + '`',
							inline: true,
						},
						{
							name: 'Uptime',
							value: '`' + ms(bot.client.uptime) + '`',
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
