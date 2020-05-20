const fetch = require('node-fetch');

exports.run = async (bot, message) => {
	if (!message.member.roles.cache.find(r => r.name === 'NSFW')) {
		return message.reply(bot.lang.NOT_ALLOWED);
	}

	if (!message.channel.nsfw) {
		return message.reply(bot.lang.FORBIDDEN);
	}

	await fetch('http://api.oboobs.ru/boobs/0/1/random')
		.then(res => res.json())
		.then(json => {
			const embed = {
				color: ((1 << 24) * Math.random()) | 0,
				timestamp: `${message.createdAt}`,
				image: {
					url: `http://media.oboobs.ru/${json[0].preview}`,
				},
			};
			message.channel.send({ embed });
		});
};

exports.help = async (bot, message) => {
	const embed = {
		color: ((1 << 24) * Math.random()) | 0,
		title: bot.lang.C_USAGE_TITLE,
		description: bot.lang.C_USAGE.BOOBS.replace('{{syntax}}', `${bot.config.prefix}boobs`),
	};

	message.channel.send({ embed });
};
