const fetch = require('node-fetch');

exports.run = async (bot, message) => {
	if (!message.member.roles.find(r => r.name === 'NSFW')) {
		return message.channel.send('No puedes utilizar este comando');
	}

	if (!message.channel.nsfw) {
		return message.channel.send('No puede utilzar este comando aquí');
	}

	await fetch('http://api.obutts.ru/butts/0/1/random')
		.then(res => res.json())
		.then(json => {
			const embed = {
				color: ((1 << 24) * Math.random()) | 0,
				timestamp: `${message.createdAt}`,
				image: {
					url: `http://media.obutts.ru/${json[0].preview}`,
				},
			};
			message.channel.send({ embed });
		});
};
