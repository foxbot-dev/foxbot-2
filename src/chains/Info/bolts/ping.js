const { MessageEmbed } = require('discord.js');
const Foxbot = require('../../../client/Foxbot.js');
const Bolt = require('../../../structures/Bolt.js');
const colors = require('../../../constants/colors.js');

class ping extends Bolt {
	constructor(...args) {
		super(...args);
		this.name = 'ping';
	}

	/**
	 * @param {{ bot: Foxbot, message: import('discord.js').Message, args: Array[string] }}}
	 */
	async execute({ bot, message, args }) {
		const t = Date.now();
		await message.reply('Ping...').then(async (r) => {
			const t1 = Date.now();
			await r.edit({
				embeds: [
					new MessageEmbed({
						title: 'Pong! 🏓',
						fields: [
							{
								name: 'WS Latency',
								value: '`' + bot.client.ws.ping + 'ms`',
							},
							{
								name: 'API Latency',
								value: '`' + (t1 - t) + 'ms`',
							},
						],
						color: colors.default,
					}),
				],
			});
		});
	}
}

module.exports = ping;
