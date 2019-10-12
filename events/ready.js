module.exports = bot => {
	bot.LogIt.log(`Estoy funcionando y sirviendo a ${bot.users.size} usuarios`);
	bot.user.setPresence({
		status: 'online',
		game: { type: 'watching', name: 'una snuff [DEV]' },
	});
};
