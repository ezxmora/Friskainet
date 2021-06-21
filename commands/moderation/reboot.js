exports.run = async (bot, message) => {
	const modRole = message.guild.roles.find(role => role.name === bot.config.roleAdmin);
	if (!modRole) return bot.LogIt.warn(bot.lang.ROLE_DOESNT_EXIST);

	if (!message.member.roles.has(modRole.id)) return message.reply(bot.lang.NOT_ALLOWED);

	await message.reply(bot.lang.C_MSG.REBOOT);
	bot.commands.forEach(async cmd => {
		await bot.unloadCommand(cmd);
	});
	bot.LogIt.log(bot.lang.C_MSG.REBOOT);
	process.exit(0);
};

exports.help = async (bot, message) => {
	const embed = {
		color: ((1 << 24) * Math.random()) | 0,
		title: bot.lang.C_USAGE_TITLE,
		description: bot.lang.C_USAGE.REBOOT.replace('{{syntax}}', `${bot.config.prefix}reboot`),
	};

	message.channel.send({ embed });
};
