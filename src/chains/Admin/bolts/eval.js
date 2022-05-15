const Bolt = require('../../../structures/Bolt.js');
const each = require('async-each');
const config = require('../../../config/config.js');
const colors = require('../../../constants/colors.js');

const blocks = ['BOT_TOKEN', 'MONGO_AUTH', 'MONGO_USER', 'REDIS_HOST'].map(r => process.env[r])

class evalc extends Bolt {
	constructor(...args) {
		super(...args);
		this.name = 'eval';
		this.sudo = true;
	}

	/**
	 * @param {{ message: import('discord.js').Message, args: Array[string] }}}
	 */
	async execute({ message }) {
		const code = message.content
			.slice(message.content.indexOf('eval') + 4)
			.trim()
			.replace(/^```js|```$/g, '');

		// For time
		const t1 = Date.now();
		let res;
		try {
			res = await eval(`(async () => {${code}\n})().catch(e => {return e})`).catch((e) => {
				return e;
			});
		} catch (e) {
			res = e;
		}
		const t2 = Date.now();

		// log
		await this.bot.db.collection('eval-logs').insertOne({
			id: message.author.id,
			src: code,
		});

		// Process result
		if (res && res.stack && res.message) {
			// Block sensitive info
			blocks.forEach((r) => (res = res.toString().replace(new RegExp(r, 'gi'), '<potato>')));

			// Parsing large evals
			if (res && res.toString().length > 1950) res = res.match(/(.|[\r\n]){1,4000}/g);

			// if eval was large
			if (Array.isArray(res)) {
				await message.reply({
					embeds: [
						{
							title: 'Failed to Evaluate Code',
							description: '```js\n' + res.shift() + '```',
							color: colors.red,
							timestamp: t2,
							footer: {
								text: `Evaluated in ${t2 - t1}ms`,
							},
						},
					],
				});
				return each(res, async (r, next) => {
					await message.channel.send({
						embeds: [
							{
								description: '```js\n' + r + '```',
								color: colors.red,
								timestamp: t2,
								footer: {
									text: `Evaluated in ${t2 - t1}ms`,
								},
							},
						],
					});
					next();
				});
			}

			// Otherwise normal
			await message.reply({
				embeds: [
					{
						title: 'Failed to Evaluate Code',
						description: '```js\n' + res.toString() + '```',
						color: colors.red,
						timestamp: t2,
						footer: {
							text: `Evaluated in ${t2 - t1}ms`,
						},
					},
				],
			});
		} else {
			// Block sensitive info
			if (res) blocks.forEach((r) => (res = res.toString().replace(new RegExp(r, 'gi'), '<potato>')));

			// Log eval
			await this.bot.db.collection('eval-logs').insertOne({
				id: message.author.id,
				src: code,
			});

			// Parse large eval
			if (res && res.toString().length > 1950) res = res.match(/(.|[\r\n]){1,4000}/g);

			// if eval was large
			if (Array.isArray(res)) {
				const t2 = Date.now();
				await message.reply({
					embeds: [
						{
							title: 'Evaluated Code',
							description: '```js\n' + res.shift() + '```',
							color: colors.default,
							timestamp: t2,
							footer: {
								text: `Evaluated in ${t2 - t1}ms`,
							},
						},
					],
				});
				return each(res, async (r, next) => {
					await message.channel.send({
						embeds: [
							{
								description: '```js\n' + r + '```',
								color: colors.default,
								timestamp: t2,
								footer: {
									text: `Evaluated in ${t2 - t1}ms`,
								},
							},
						],
					});
					next();
				});
			}

			await message.reply({
				embeds: [
					{
						title: 'Evaluated Code',
						description: '```js\n' + res + '```',
						color: colors.default,
						timestamp: t2,
						footer: {
							text: `Evaluated in ${t2 - t1}ms`,
						},
					},
				],
			});
		}
	}
}

module.exports = evalc;
