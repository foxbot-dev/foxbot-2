module.exports = function messageCreate(bot, message) {
	if (message.author.bot) return;

	if (
		message.channel.type !== 'dm' &&
		(!message.guild.available || !message.channel.permissionsFor(bot.client.user.id).has('SEND_MESSAGES'))
	)
		return;
	if (message.guild.me.isCommunicationDisabled()) return;

	message.reply(message.content.split('').reverse().join(''));
};
