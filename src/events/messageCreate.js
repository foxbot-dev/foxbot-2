const { prefix: defaultPrefix } = require('../config/config.js');
const colors = require('../constants/colors.js');

/**
 *
 * @param {import('../client/Foxbot.js')} bot
 * @param {import('discord.js').Message} message
 * @returns
 */
module.exports = async function messageCreate(bot, message) {
	if (message.author.bot) return;

	// guild avail.
	if (
		message.channel.type !== 'dm' &&
		(!message.guild.available || !message.channel.permissionsFor(bot.client.user.id).has('SEND_MESSAGES'))
	)
		return;
	if (message.guild.me.isCommunicationDisabled()) return;

	// check for prefix
	// TODO: guild prefixes
	let prefix = await bot.getPrefix(message.guildId)

	if (![prefix, `<@${bot.client.user.id}>`, `<@!${bot.client.user.id}>`].some((r) => message.content.startsWith(r)))
		return;

	let args;
	{
		const pr = [prefix, `<@${bot.client.user.id}>`, `<@!${bot.client.user.id}>`].find((r) =>
			message.content.startsWith(r)
		);
		args = message.content
			.slice(pr.length)

		if (!args.trim().length) return

		args = args
			.match(/(?<!\\)".*?"|[^ ]+/g)
			.map((str) => str.replace(/"/g, ''));
	}

	// cmd exec
	const cmdName = args.shift();
	const cmd = bot.bolts.get(cmdName);
	if (!cmd) return;

	// check channel type, perms
	if (message.channel.type !== 'dm' && !message.guild.me.permissions.has('EMBED_LINKS'))
		return message.channel.send('I need the `EMBED_LINKS` permission to be able to run properly!');

	// cmd cooldown
	if (cmd.cooldown) {
		const cd = await bot.redis.pTTL(`cooldown:${message.author.id}:${cmdName}`);
		if (cd < 0) {
			bot.redis.set(`cooldown:${message.author.id}:${cmdName}`, 1, { PX: cmd.cooldown });
		} else {
			return message.channel.send({
				embeds: [
					{
						title: 'Slow down!',
						color: colors.red,
						description: `You're on cooldown for ${(cd / 1000).toFixed(1)}s`,
					},
				],
			});
		}
	}

	if (cmd.sudo) {
		if (!(await bot.getUserConfig(message.author.id)).sudo) return
	}

	await cmd.execute({ bot, message, args });
};
