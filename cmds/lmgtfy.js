exports.run = async (bot, message, args) => {
	const username = message.mentions.members.first();
	const query = args.slice(1).join('+');
	message.delete();
	if (!username) return message.channel.send(bot.lang.NEED_MENTION);

	if (!query || query.includes(username)) {
		return message.channel.send(bot.lang.C_MSG.NEEDLE);
	}

	const url = `https://lmgtfy.com/?q=${query}`;
	let finalMsg = bot.lang.C_MSG.LMGTFY_URL.replace('{{user}}', username);
	finalMsg = finalMsg.replace('{{url}}', url);
	await message.channel.send(finalMsg);
};

exports.help = async (bot, message) => {
	const embed = {
		color: ((1 << 24) * Math.random()) | 0,
		title: bot.lang.C_USAGE_TITLE,
		description: bot.lang.C_USAGE.LMGTFY.replace('{{syntax}}', `${bot.config.prefix}lmgtfy`),
	};

	message.channel.send({ embed });
};