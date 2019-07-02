exports.run = async (bot, message, args) => {
	bot.emit('guildMemberAdd', message.member || message.guild.fetchMember(message.author));
};
