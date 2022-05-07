const Bolt = require('../../../structures/Bolt.js');
const colors = require('../../../constants/colors.js');

class snipe extends Bolt {
	constructor(...args) {
		super(...args);
		this.name = 'snipe';
		this.chain = 'Fun';
	}

	/**
	 * @param {{ message: import('discord.js').Message, args: Array[string] }}}
	 */
	async execute({ message, args }) {
		// grab 10 msgs
		const rw = (await this.bot.redis.lRange(`snipe:${message.channelId}`, 0, 9))?.map((r) => JSON.parse(r));
		// if no messages
		if (!rw.length) {
			return await message.channel.send({
				embeds: [
					{
						description: `No messages to snipe.`,
						timestamp: Date.now(),
						color: colors.red,
					},
				],
			});
		}

		// make first msg
		let msg;
		{
			const author = await this.bot.client.users.fetch(rw[0][0]);
			msg = {
				embeds: [
					{
						author: {
							name: author.tag,
							iconURL: author.avatarURL(),
						},
						description: rw[0][2],
						timestamp: rw[0][1],
						color: colors.default,
						footer: {
							text: `1/${rw.length}`
						}
					},
				],
				components: [
					{
						type: 1,
						components: [
							{
								type: 2,
								style: 1,
								emoji: '⏪',
								customId: 'bback',
							},
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
							{
								type: 2,
								style: 1,
								emoji: '⏩',
								customId: 'fforward',
							},
						],
					},
				],
			};
		}

		// if one message, no buttons
		if (rw.length == 1) {
			msg.components[0].components = msg.components[0].components.map(r => Object.assign(r, { disabled: true }))
			return await message.reply(msg)
		}

		// register button collect
		await message.reply(msg).then((r) => {
			const coll = r.createMessageComponentCollector({
				filter: (i) => i.user.id === message.author.id,
				time: 30000,
			});

			let currInd = 0;
			coll.on('collect', async (i) => {
				switch (i.customId) {
					case 'bback':
						currInd = 0;
						break;

					case 'back':
						currInd = Math.max(0, currInd - 1);
						break;

					case 'forward':
						currInd = Math.min(rw.length, currInd + 1);
						break;

					case 'fforward':
						currInd = 9;
						break;
				}
				const ms = rw[currInd]
				const author = await this.bot.client.users.fetch(ms[0])

				msg.embeds[0].author = {
					name: author.tag,
					iconURL: author.avatarURL(),
				}
				msg.embeds[0].description = ms[2]
				msg.embeds[0].timestamp = ms[1]
				msg.embeds[0].footer.text = `${currInd + 1}/${rw.length}`

				await i.update(msg)
			});

			coll.on('end', () => {
				msg.components[0].components.forEach((r) => (r.disabled = true));
				r.edit(msg);
			});
		});
	}

	async messageDelete(/** @type {import('discord.js').Message} */ message) {
		const l = await this.bot.redis.lPush(
			`snipe:${message.channelId}`,
			JSON.stringify([message.author.id, message.createdTimestamp, message.content])
		);
		if (l > 15) await this.bot.redis.lTrim(`snipe:${message.channelId}`, 0, 9);
	}
}

module.exports = snipe;
