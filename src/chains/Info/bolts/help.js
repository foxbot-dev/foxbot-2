const { MessageEmbed } = require('discord.js');
const Foxbot = require('../../../client/Foxbot.js');
const Bolt = require('../../../structures/Bolt.js');
const colors = require('../../../constants/colors.js');

class help extends Bolt {
	constructor(...args) {
		super(...args);
		this.name = 'help';
	}

	/**
	 * @param {{ bot: Foxbot, message: import('discord.js').Message, args: Array[string] }}}
	 */
	async execute({ bot, message, args }) {
		const msg = {
			embeds: [
				{
					title: 'Foxbot Help',
					description: 'Use the message buttons to navigate!',
					timestamp: Date.now(),
					color: colors.default,
					footer: {
						text: `Foxbot!`,
					},
					fields: [

					]
				},
			],
			components: [
				{
					type: 1,
					components: [
						{
							type: 2,
							style: 1,
							emoji: '◀️',
							customId: 'back',
						},
						{
							type: 2,
							style: 1,
							emoji: '▶️',
							customId: 'forward',
						},
					],
				},
			],
		};

		message.reply(msg).then((r) => {
			const coll = r.createMessageComponentCollector({
				filter: (i) => i.user.id === message.author.id,
				time: 30000,
			});

			let currInd = 0;
			coll.on('collect', async (i) => {
				switch (i.customId) {
					case 'back':
						currInd = Math.max(0, currInd - 1);
						if (currInd == 0) {
							msg.components[0].components[0].disabled = true;

							msg.components[0].components[0].style = 2;
							msg.components[0].components[1].style = 1;
						}
						break;

					case 'forward':
						currInd = Math.min(bot.chains.size - 1, currInd + 1);
						if (currInd == bot.chains.size - 1) {
							msg.components[0].components[0].disabled = false;

							msg.components[0].components[0].style = 1;
							msg.components[0].components[1].style = 2;
						}
						break;
				}
				
				const c = bot.chains.at(currInd)
				msg.embeds[0].description = `${c.description}`
				msg.embeds[0].fields[0] = {
					name: `Commands`,
					value: `${c.bolts.map(r => r.name).join('\n')}`}
				msg.embeds[0].title = c.name
				msg.embeds[0].footer.text = `${currInd + 1}/${bot.chains.size}`;

				await i.update(msg);
			});

			coll.on('end', () => {
				msg.components[0].components.forEach((r) => Object.assign(r, { disabled: true, style: 2 }));
				r.edit(msg);
			});
		});
	}
}

module.exports = help;
