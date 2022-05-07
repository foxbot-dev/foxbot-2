const { MessageEmbed } = require('discord.js');
const { prefix } = require('../config/config.js')

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
	if (![prefix, `<@${bot.client.user.id}>`, `<@!${bot.client.user.id}>`].some(r => message.content.startsWith(r))) return;

	let args;
	{
		const pr = [prefix, `<@${bot.client.user.id}>`, `<@!${bot.client.user.id}>`].find((r) => message.content.startsWith(r));
		args = message.content
			.slice(pr.length)
			.match(/(?<!\\)".*?"|[^ ]+/g)
			.map(str => str.replace(/"/g, ''));
	}

	const cmdName = args.shift();
	const cmd = bot.bolts.get(cmdName)
	if (!cmd) return

	if (message.channel.type !== 'dm' && !message.guild.me.permissions.has('EMBED_LINKS')) return message.channel.send('I need the `EMBED_LINKS` permission to be able to run properly!');

	await cmd.execute({ bot, message, args })
};
