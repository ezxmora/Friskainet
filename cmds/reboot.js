exports.run = async (bot, message) => {
	await message.reply('Me estoy reiniciando...');
	bot.commands.forEach(async cmd => {
		await bot.unloadCommand(cmd);
	});
	bot.LogIt.log('Me estoy reiniciando...');
	process.exit(0);
};

exports.help = async (bot, message) => {
	const embed = {
		color: ((1 << 24) * Math.random()) | 0,
		title: 'Uso del comando',
		description: 'Yo que se mano\n_<Test>_',
	};

	message.channel.send({ embed });
};
