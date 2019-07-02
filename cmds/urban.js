const urban = require('urban');

exports.run = async (bot, message, args) => {
	const query = args.slice(0).join(' ');
	if (query === '') return message.reply('Tienes que especificar algo para buscar');

	/**
	 * Hacemos la búsqueda gracias a la librería urban y
	 * devolvemos la respuesta en caso de haberla
	 */
	await urban(query).first(response => {
		if (!query) return message.channel.send('No he encontrado nada');

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
