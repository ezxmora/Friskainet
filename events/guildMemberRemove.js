module.exports = (bot, member) => {
	const defaultChannel = member.guild.channels.cache.find(channel => channel.name === 'entrada');
	defaultChannel.send(bot.lang.LEAVE.replace('{{user}}', member)).then((c) => c.react('🇫'));
	bot.LogIt.log(bot.lang.SYS.LEAVE.replace('{{user}}', member.user.tag));
};
