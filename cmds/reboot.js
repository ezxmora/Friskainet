exports.run = async (bot, message) => {
	const modRole = message.guild.roles.find(role => role.name === bot.config.roleAdmin);
	if (!modRole) return bot.LogIt.warn('El rol no existe en el servidor');

	if (!message.member.roles.has(modRole.id)) return message.reply('No puedes usar este comando');

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
		title: bot.lang.C_USAGE_TITLE,
		description: 'Yo que se mano\n_<Test>_',
	};

	message.channel.send({ embed });
};
