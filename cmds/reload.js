exports.run = async (bot, message, args) => {
	const modRole = message.guild.roles.find(role => role.name === bot.config.roleAdmin);
	if (!modRole) {
		return bot.LogIt.warn(bot.lang.ROLE_DOESNT_EXIST);
	}

	if (!message.member.roles.has(modRole.id)) return message.reply(bot.lang.NOT_ALLOWED);

	if (!args || args.size < 1) {
		return message.reply(bot.lang.C_MSG.NEED_PARAM_RELOAD);
	}
	const commandName = args[0];

	if (!bot.commands.has(commandName)) {
		return message.reply(bot.lang.C_MSG.RELOAD_DOESNT_EXIST);
	}
	// Relative route form this script
	delete require.cache[require.resolve(`./${commandName}.js`)];
	// Reload from the collection where the commands are stored
	await bot.commands.delete(commandName);
	const props = require(`./${commandName}.js`);
	bot.commands.set(commandName, props);

	message.reply(bot.lang.C_MSG.RELOAD_RELOADED.replace('{{command}}', commandName));
	bot.LogIt.log(bot.lang.C_MSG.RELOAD_RELOADED.replace('{{command}}', commandName));
};

exports.help = async (bot, message) => {
	const embed = {
		color: ((1 << 24) * Math.random()) | 0,
		title: bot.lang.C_USAGE_TITLE,
		description: bot.lang.C_USAGE.RELOAD.replace('{{syntax}}', `${bot.config.prefix}reload`),
	};

	message.channel.send({ embed });
};
