const Bolt = require('../../../structures/Bolt.js');
const proc = require('child_process');
const config = require('../../../config/config.js');
const colors = require('../../../constants/colors.js');

const blocks = ['BOT_TOKEN', 'MONGO_AUTH', 'MONGO_USER', 'REDIS_HOST'].map((r) => process.env[r]);

class exec extends Bolt {
	constructor(...args) {
		super(...args);
		this.name = 'exec';
		this.sudo = true;
	}

	/**
	 * @param {{ message: import('discord.js').Message, args: Array[string] }}}
	 */
	async execute({ message, argsStr }) {
		const t1 = Date.now();
		let res;

		try {
			const out = await new Promise((res, rej) => {
				proc.exec(
					argsStr,
					{
						shell: '/bin/bash',
					},
					(err, stdout, stderr) => {
						if (err) rej(err);
						return res({ stdout, stderr });
					}
				);
			});

			// if error
			const d = Date.now();
			if (out.stderr) {
				const err = out.stderr.toString();
				const errs = err.match(/(.|\n){1,4000}/g);
				message.reply({
					embeds: [
						{
							title: 'Failed to execute command',
							description: '```js\n' + errs.shift() + '```',
							color: colors.red,
							timestamp: t1,
							footer: {
								text: `Exit code 0 • Executed in ${d - t1}ms`,
							},
						},
					],
				});
				errs.forEach(r => {
					message.reply({
						embeds: [
							{
								description: '```js\n' + r + '```',
								color: colors.red,
								timestamp: t1,
								footer: {
									text: `Exit code 0 • Executed in ${d - t1}ms`,
								},
							},
						],
					});
				})
			} else {
				// otherwise send normal
				const outs = out.stdout.match(/(.|\n){1,4000}/g)
				await message.reply({
					embeds: [
						{
							title: 'Command run successfully',
							description: '```js\n' + outs.shift() + '```',
							color: colors.default,
							timestamp: t1,
							footer: {
								text: `Exit code 0 • Executed in ${d - t1}ms`,
							},
						},
					],
				});
				outs.forEach(r => {
					message.reply({
						embeds: [
							{
								description: '```js\n' + r + '```',
								color: colors.default,
								timestamp: t1,
								footer: {
									text: `Exit code 0 • Executed in ${d - t1}ms`,
								},
							},
						],
					});
				})
			}
		} catch (e) {
			// errored
			const d = Date.now();
			const err = e.toString();
			const errs = err.match(/(.|\n){1,4000}/g);
			await message.reply({
				embeds: [
					{
						title: 'Failed to execute command',
						description: '```js\n' + errs.shift() + '```',
						color: colors.red,
						timestamp: t1,
						footer: {
							text: `Exit code ${e.code} • Executed in ${d - t1}ms`,
						},
					},
				],
			});
			return errs.forEach(r => {
				message.reply({
					embeds: [
						{
							description: '```js\n' + r + '```',
							color: colors.red,
							timestamp: t1,
							footer: {
								text: `Exit code ${e.code} • Executed in ${d - t1}ms`,
							},
						},
					],
				});
			})
		}
	}
}

module.exports = exec;
