module.exports = {
	name: 'message',
	once: false,
	execute: async (message, bot) => {
		if (message.author.bot || message.author.system) return;

		// Doesn't listen to DMs
		if (message.channel.type === 'dm') return;

		// Checks if the user is in the blacklist
		// const user = bot.User({ discordId: message.author.id });
		// if (user.isUserBlacklisted(bot)) return;

		// It gives away some tokens.
		// await bot.db.modTokens(bot, message.author.id, Math.ceil(Math.random() * 10));

		// Checks that he message has the prefix and it's a valid command.
		if (!message.content.startsWith(bot.config.prefix)) return;

		const args = message.content.slice(bot.config.prefix.length).trim().split(/ +/);
		const cmd = args.shift().toLowerCase();

		// The command doesn't exist
		if (!bot.commands.has(cmd)) return;

		const command = bot.commands.get(cmd);

		// The command needs permissions
		if (command.permissions) {
			const authorPerms = message.channel.permissionsFor(message.author);

			if (!authorPerms || !authorPerms.has(command.permissions)) {
				return message.reply('No tienes permisos para ejecutar este comando');
			}
		}
		
		const cooldowns = bot.commandCooldowns;

		// There is no cooldown
		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Map());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;

		// Exists the cooldown
		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
			}
		}

		// Adds the cooldown
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		// Missing arguments
		if (command.args && !args.length) {
			let reply = `No has puesto ningún argumento, ${message.author}`;

			if (command.usage) {
				reply += `\nEl uso correcto sería: \`${bot.config.prefix}${command.name} ${command.usage}\``
			}
			return message.channel.send(reply);
		}

		try {
			bot.LogIt.cmd(`${message.author.tag} ha ejecutado ${command.name}`)
			command.run(message, args);
		} catch (error) {
			bot.LogIt.error(`Ha habido un error\n ${error}`);
		}
	}
};
