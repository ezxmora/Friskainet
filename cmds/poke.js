exports.run = async (bot, message, args) => {
	const userMention = message.mentions.members.first();

	if (!userMention) return message.reply('Tienes que mencionar a un usuario que quieras pokear');

	if (args.slice(1).join(' ').length > 2049) {
		return message.reply('El mensaje tiene que ser menor de 2048 caracteres');
	}

	try {
		const embed = {
			title: `${message.author.username} te ha pokeado`,
			description: `${args.slice(1).join(' ')}`,
			color: ((1 << 24) * Math.random()) | 0,
			timestamp: `${message.createdAt}`,
			thumbnail: {
				url: `${message.author.avatarURL()}`,
			},
		};
		await userMention.send({ embed: embed });
		bot.LogIt.cmd(`${message.author.username} ha pokeado a ${userMention}`);
	}
	catch (err) {
		message.reply(`No he podido pokear a ${userMention} porque tiene los PM deshabilitados`);
		bot.LogIt.error(`No se ha podido mandar el poke de ${message.author.tag} a ${userMention.nickname}`);
	}
};

exports.help = async (bot, message) => {
	const embed = {
		color: ((1 << 24) * Math.random()) | 0,
		title: 'Uso del comando',
		description: 'Yo que se mano\n_<Test>_',
	};

	message.channel.send({ embed });
};