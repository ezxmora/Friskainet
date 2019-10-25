exports.run = async (bot, message) => {
	const topUsers = bot.db.toptokens();
	const medals = ['🥇', '🥈', '🥉'];
	let description = '';
	let avatarTop = '';

	await topUsers
		.then(users => {
			users.forEach((User, i) => {
				if (i == 0) {
					bot.fetchUser(User.idUser).then(myUser => {
						avatarTop += myUser.avatarURL;
					});
				}
				description += `${medals[i]} ${User.username}  **Tokens ${User.tokens}**\n`;
			});
		})
		.catch(err => {
			bot.LogIt.error(err);
		});

	const embed = {
		title: bot.lang.C_MSG.TOPTOKEN_TOP,
		description: description,
		color: ((1 << 24) * Math.random()) | 0,
		thumbnail: {
			url: avatarTop,
		},
	};
	await message.channel.send({ embed });
};

exports.help = async (bot, message) => {
	const embed = {
		color: ((1 << 24) * Math.random()) | 0,
		title: bot.lang.C_USAGE_TITLE,
		description: bot.lang.C_USAGE.TOPTOKEN.replace('{{syntax}}', `${bot.config.prefix}toptoken`),
	};

	message.channel.send({ embed });
};