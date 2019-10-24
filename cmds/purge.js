exports.run = async (bot, message) => {
	await message.channel.messages.fetch()
		.then((msg) => {
			let msgFilter = msg.filter(m => !m.pinned && m.author.id === message.author.id);

			if (message.member.hasPermission('MANAGE_MESSAGES')) {
				msgFilter = msg.filter(m => !m.pinned);
			}

			message.channel.bulkDelete(msgFilter, true)
				.then(() => bot.LogIt.log(`Se han borrado ${msgFilter.size} mensajes`))
				.catch(console.error);
		})
		.catch((err) => {
			bot.LogIt.error(err);
		});
};

exports.help = async (bot, message) => {
	const embed = {
		color: ((1 << 24) * Math.random()) | 0,
		title: bot.lang.C_USAGE_TITLE,
		description: bot.lang.C_USAGE.PURGE.replace('{{syntax}}', `${bot.config.prefix}purge`),
	};

	message.channel.send({ embed });
};
