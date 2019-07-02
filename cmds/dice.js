exports.run = async (bot, message, args) => {
	const dices = args[0];
	const bet = args[1];
	const guessNum = args[2];
	let wins = 0;
	let output = '';
	let result = '';
	const tokens = await bot.db
		.getUser(message.author.id)
		.then(res => {
			return res[0].tokens;
		})
		.catch(err => {
			bot.LogIt.error(err);
		});

	if (isNaN(dices) || (dices <= 0 && dices > 7)) {
		return message.reply('Tienes que introducir un número de dados válido [0-6]');
	}

	if (isNaN(bet)) return message.reply('La cantidad de la apuesta tiene que ser un número');

	if (isNaN(guessNum) || (guessNum <= 0 && guessNum > 11)) {
		return message.reply('El número de dados tiene que ser un número [1-10]');
	}

	if (tokens < bet) {
		return message.reply(
			`La apuesta es mayor que el número de tokens, tienes ${tokens} tokens`
		);
	}

	bot.db.modTokens(bot, message.author.id, -bet);

	for (let i = 1; i <= dices; i++) {
		const generateNumber = Math.ceil(Math.random() * 6);
		if (generateNumber == guessNum) {
			wins++;
		}

		switch (generateNumber) {
			case 1:
				output += ':one:';
				break;

			case 2:
				output += ':two:';
				break;

			case 3:
				output += ':three:';
				break;

			case 4:
				output += ':four:';
				break;

			case 5:
				output += ':five:';
				break;

			case 6:
				output += ':six:';
				break;
		}
	}

	if (wins == 0) {
		result = 'Has perdido, suerte la próxima';
	} else if (wins == 1) {
		result = `Has ganado una vez y te has embolsado ${bet * (bot.config.betRatio * 1)} tokens`;
		bot.db.modTokens(bot, message.author.id, bet);
		bot.db.modTokens(bot, message.author.id, bet * (bot.config.betRatio * 1));
	} else {
		result = `Has ganado ${wins} veces y te has embolsado ${bet *
			(bot.config.betRatio * wins)} tokens`;
		bot.db.modTokens(bot, message.author.id, bet);
		bot.db.modTokens(bot, message.author.id, bet * (bot.config.betRatio * wins));
	}

	const embed = {
		title: 'Resultado de los dados',
		description: output,
		color: ((1 << 24) * Math.random()) | 0,
		footer: {
			text: result,
		},
		thumbnail: {
			url: message.author.avatarURL,
		},
	};

	message.channel.send({ embed });
};
