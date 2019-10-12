exports.run = async (bot, message, args) => {
	const needleMessage = args
		.slice(1)
		.join(' ')
		.toLowerCase();

	// Comprobamos que tenga permisos para borrar mensajes
	if (message.member.hasPermission('MANAGE_MESSAGES')) {
		if (isNaN(args[0])) {
			return message.reply(
				'Tienes que introducir una cantidad de mensajes que quieras borrar'
			);
		}

		if (needleMessage === '') {
			return message.reply('Tienes que especificar algo que quieras borrar');
		}
		// Recogemos todos los mentajes que complan el criterio y los borramos
		const limit = Number(args[0]) + 1;
		await message.channel
			.fetchMessages({ limit: limit })
			.then(msg => {
				const botMessages = msg.filter(
					m => m.content.toLowerCase().includes(needleMessage) && !m.pinned
				);

				message.channel
					.bulkDelete(botMessages, true)
					.then(m => bot.LogIt.log(`Se han borrado ${m.size} mensajes`))
					.catch(console.error);
			})
			.catch(err => {
				console.log(err);
			});
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