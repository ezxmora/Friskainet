module.exports = async (bot) => {
	bot.LogIt.log(`Estoy funcionando y sirviendo a ${bot.users.size} usuarios`);
	bot.user.setPresence({ activity: { name: bot.config.presence[0], type: bot.config.presence[1] }, status: 'idle' });
};
