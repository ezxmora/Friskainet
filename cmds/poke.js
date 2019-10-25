exports.run = async (bot, message, args) => {
	const userMention = message.mentions.members.first();

	if (!userMention) return message.reply(bot.lang.NEED_MENTION);

	if (args.slice(1).join(' ').length > 2001) {
		return message.reply(bot.lang.C_MSG.POKE_CHARS);
	}

	try {
		const embed = {
			title: bot.lang.C_MSG.POKE_TITLE.replace('{{user}}', message.author.username),
			description: `${args.slice(1).join(' ')}`,
			color: ((1 << 24) * Math.random()) | 0,
			timestamp: `${message.createdAt}`,
			thumbnail: {
				url: `${message.author.avatarURL()}`,
			},
		};
		await userMention.send({ embed: embed });
		let pokedBy = bot.lang.C_MSG.POKE_SYS.replace('{{user}}', message.author.username);
		pokedBy = pokedBy.replace('{{mention}}', userMention);
		bot.LogIt.cmd(pokedBy);
	}
	catch (err) {
		message.reply(bot.lang.C_MSG.POKE_ERR.replace('{{mention}}', userMention));
		bot.LogIt.error(bot.lang.C_MSG.POKE_ERR.replace('{{mention}}', userMention));
	}
};

exports.help = async (bot, message) => {
	const embed = {
		color: ((1 << 24) * Math.random()) | 0,
		title: bot.lang.C_USAGE_TITLE,
		description: bot.lang.C_USAGE.POKE.replace('{{syntax}}', `${bot.config.prefix}poke`),
	};

	message.channel.send({ embed });
};