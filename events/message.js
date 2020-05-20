module.exports = async (bot, message) => {
	if (message.author.bot || message.author.system) return;

	// Doesn't listen to DMs
	if (message.channel.type === 'dm') return;

	// Checks if the user is in the blacklist
	const user = bot.User({ discordId: message.author.id });
	if (user.isUserBlacklisted(bot)) return;

	// It gives away some tokens.
	// await bot.db.modTokens(bot, message.author.id, Math.ceil(Math.random() * 10));

	// Checks that he message has the prefix and it's a valid command.
	if (message.content.indexOf(bot.config.prefix) !== 0) return;

	const args = message.content
		.slice(bot.config.prefix.length)
		.trim()
		.split(/ +/g);
	const cmd = args.shift().toLowerCase();

	const command = bot.commands.get(cmd);

	if (!command) return;

	if (args[0] == 'help') {
		await command.help(bot, message);
	}
	else {
		await command.run(bot, message, args);
	}
};
