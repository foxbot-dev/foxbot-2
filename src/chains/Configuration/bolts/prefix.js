const Bolt = require('../../../structures/Bolt.js');
const colors = require('../../../constants/colors.js');

class prefix extends Bolt {
	constructor(...args) {
		super(...args);
		this.name = 'prefix';
		this.description = 'Set or view the current guild prefix'
		this.usage = '[prefix]'
	}

	/**
	 * @param {{ message: import('discord.js').Message, args: Array[string] }}}
	 */
	async execute({ message, args }) {
		if (!args.length) {
			return message.reply({
				embeds: [
					{
						description: `The prefix for ${message.guild.name} is ${
							await this.bot.getPrefix(message.guildId)
						}`,
					},
				],
			});
		} else {
			if (args[0].length > 100)
				return message.reply({
					embeds: [
						{
							title: 'An error occurred',
							color: colors.red,
							description: '```js\n' + 'Prefix may not exceed 100 characters.' + '\n```',
							timestamp: Date.now(),
						},
					],
				});
			await this.bot.setPrefix(message.guildId, args[0])
			return message.reply({
				embeds: [
					{
						description: `Updated prefix for ${message.guild.name} to ${
							(args[0].startsWith('`') ? '`` ' : '``') + args[0] + (args[0].endsWith('`') ? ' ``' : '``')
						}`,
					},
				],
			});
		}
	}
}
module.exports = prefix;
