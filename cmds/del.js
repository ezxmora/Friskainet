exports.run = async (bot, message, args) => {
	const needleMessage = args.slice(1).join(' ').toLowerCase();
	const amountMessages = parseInt(args[0]) + 1;

	if (isNaN(amountMessages)) {
		exports.help(bot, message);
		return message.reply(bot.lang.C_MSG.DEL_QUANT);
	}

	if (needleMessage === '') {
		exports.help(bot, message);
		return message.reply(bot.lang.C_MSG.DEL_NEEDLE);
	}


	// Fetchs the messages and deletes all of them that fullfills the criteria
	await message.channel.messages.fetch({ limit: amountMessages })
		.then((msg) => {
			let filteredMessages = msg.filter(m => m.content.toLowerCase().includes(needleMessage) && !m.pinned && m.author.id === message.author.id);

			if (message.member.hasPermission('MANAGE_MESSAGES')) {
				filteredMessages = msg.filter(m => m.content.toLowerCase().includes(needleMessage) && !m.pinned);
			}

			message.channel.bulkDelete(filteredMessages, true)
				.then(m => bot.LogIt.log(bot.lang.C_MSG.DEL_N.replace('{{size}}', m.size)))
				.catch(console.error);
		})
		.catch(err => {
			bot.LogIt.error(err);
		});

};

exports.help = async (bot, message) => {
	const embed = {
		color: ((1 << 24) * Math.random()) | 0,
		title: bot.lang.C_USAGE_TITLE,
		description: bot.lang.C_USAGE.DEL.replace('{{syntax}}', `${bot.config.prefix}del`),
	};

	message.channel.send({ embed });
};