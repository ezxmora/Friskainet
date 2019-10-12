const fetch = require('node-fetch');

exports.run = async (bot, message) => {
	if (!message.member.roles.find(r => r.name === 'NSFW')) {
		return message.reply('No puedes utilizar este comando');
	}

	if (!message.channel.nsfw) {
		return message.reply('No puede utilzar este comando aquí');
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
		title: 'Uso del comando',
		description: 'Yo que se mano\n_<Test>_',
	};

	message.channel.send({ embed });
};