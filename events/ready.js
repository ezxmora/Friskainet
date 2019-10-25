module.exports = async (bot) => {
	bot.LogIt.log(bot.lang.S_READY.replace('{{users}}', bot.users.size));
	bot.user.setPresence({ activity: { name: bot.config.presence[0], type: bot.config.presence[1].toUpperCase() }, status: bot.config.presence[2].toLowerCase() });
};
