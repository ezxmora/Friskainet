module.exports = {
	name: 'ready',
	once: true,
	execute(bot) {
		bot.LogIt.log(`${bot.user.tag} funcionando y sirviendo a ${bot.users.cache.size} usuarios`);
		bot.user.setStatus(bot.config.presence.status);
		bot.user.setActivity(bot.config.presence.name, { type: bot.config.presence.type });
	}
};
