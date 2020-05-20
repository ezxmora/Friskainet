const medals = ['🥇', '🥈', '🥉'];
let description = '';
let avatarTop = '';

function buildEmbed(bot) {
	description = '';
	avatarTop = '';
	return new Promise((resolve, reject) => {
		bot.User.toptokens(function(err, response) {
			if (err) return reject(bot.LogIt.error(err));

			for (let i = 0; i < response.length; i++) {
				bot.users.fetch(response[i].discordId)
					.then((fetchedUser) => {
						if (i == 0) {
							avatarTop += fetchedUser.avatarURL({ dynamic: true });
						}
						description += `${medals[i]} ${fetchedUser.username}#${fetchedUser.discriminator} **Tokens: ${response[i].tokens}**\n`;
					})
					.then(resolve)
					.catch((err) => {
						reject(bot.LogIt.error(err));
					});
			}
		});
	});
}

exports.run = async (bot, message) => {
	await buildEmbed(bot)
		.then(() => {
			const embed = {
				title: bot.lang.C_MSG.TOPTOKEN_TOP,
				description: description,
				color: ((1 << 24) * Math.random()) | 0,
				thumbnail: { url: avatarTop },
			};
			message.channel.send({ embed });
		})
		.catch((err) => {
			bot.LogIt.error(err);
		});
};

exports.help = async (bot, message) => {
	const embed = {
		color: ((1 << 24) * Math.random()) | 0,
		title: bot.lang.C_USAGE_TITLE,
		description: bot.lang.C_USAGE.TOPTOKEN.replace('{{syntax}}', `${bot.config.prefix}toptoken`),
	};

	message.channel.send({ embed });
};