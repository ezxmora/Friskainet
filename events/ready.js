module.exports = async (bot) => {
	bot.LogIt.log(bot.lang.SYS.READY.replace('{{users}}', bot.users.cache.size));
	bot.user.setPresence({ activity: { name: bot.config.presence[0], type: bot.config.presence[1].toUpperCase() }, status: bot.config.presence[2].toLowerCase() });
};
