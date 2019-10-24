module.exports = (bot, member) => {
	const defaultChannel = member.guild.channels.find(channel => channel.name === 'entrada');
	defaultChannel.send(`${member} ${bot.lang.LEAVE}`).then((c) => c.react('🇫'));
	bot.LogIt.log(`${member.user.tag} ${bot.lang.S_LEAVE}`);
};
