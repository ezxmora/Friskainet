exports.run = async (bot, message) => {
	await message.reply('Me estoy reiniciando...');
	bot.commands.forEach(async cmd => {
		await bot.unloadCommand(cmd);
	});
	bot.LogIt.log('Me estoy reiniciando...');
	process.exit(0);
};
