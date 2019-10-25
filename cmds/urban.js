const urban = require('urban');

exports.run = async (bot, message, args) => {
	const query = args.slice(0).join(' ');
	if (query === '') return message.reply(bot.lang.C_MSG.NEEDLE);

	/**
	 * Using Urban we search for the query and
	 * we get the first response
	 */
	await urban(query).first(response => {
		if (!query) return message.channel.send(bot.lang.C_MSG.URBAN_CANT_FIND);

		const description = response.definition;

		const embed = {
			title: response.word,
			description: description
				.split('[')
				.join(' ')
				.split(']')
				.join(' '),
			url: response.permalink,
			color: ((1 << 24) * Math.random()) | 0,
			footer: {
				icon_url:
					'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/180/thumbs-up-sign_1f44d.png',
				text: `Likes: ${response.thumbs_up}`,
			},
			thumbnail: {
				url: bot.user.avatarURL,
			},
			author: {
				name: response.author,
			},
		};
		message.channel.send({ embed });
	});
};

exports.help = async (bot, message) => {
	const embed = {
		color: ((1 << 24) * Math.random()) | 0,
		title: bot.lang.C_USAGE_TITLE,
		description: bot.lang.C_USAGE.URBAN.replace('{{syntax}}', `${bot.config.prefix}urban`),
	};

	message.channel.send({ embed });
};