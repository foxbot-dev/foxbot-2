const Bolt = require('../../../structures/Bolt.js');
const colors = require('../../../constants/colors.js');
class embed extends Bolt {
	constructor(...args) {
		super(...args);
		this.name = 'embed';
		this.usage = '<json>'
		this.description = 'Create a discord embed using JSON'
	}

	/**
	 * @param {{ message: import('discord.js').Message, args: Array[string] }}}
	 */
	async execute({ message }) {
		try {
			const datae = message.content
				.slice(message.content.indexOf('embed') + 5)
				.trim()
				.replace(/^```.+\n|```$|\n/g, '');
			const json = JSON.parse(datae);
			if ((!json.title || json.title === '') && (!json.description || json.description === ''))
				return message.reply({
					embeds: [
						{
							title: 'An error occurred',
							color: colors.red,
							description: '```js\n' + 'JSON must contain a title or description.' + '\n```',
							timestamp: Date.now(),
						},
					],
				});
			return await message.channel.send({ embeds: [json] });
		} catch (e) {
			return message.reply({
				embeds: [
					{
						title: 'An error occurred',
						color: colors.red,
						description: '```js\n' + e.message + '\n```',
						timestamp: Date.now(),
					},
				],
			});
		}
	}
}

module.exports = embed;
