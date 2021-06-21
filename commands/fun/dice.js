
module.exports = {
	name: 'dice',
	description: 'Tira unos dados',
	category: 'fun',
	args: true,
	usage: '<N. dados [1-10]> <Apuesta> <N. adivinar [1-6]>',
	cooldown: 20,
	run: async (message, args) => {
		const { util, config } = message.client;
		const dices = args[0];
		const bet = args[1];
		const guessNum = args[2];
		let wins = 0;
		let output = '';
		let result = '';
		const tokens = 0;
		/* await bot.db
			.getUser(message.author.id)
			.then(res => {
				return res[0].tokens;
			})
			.catch(err => {
				bot.LogIt.error(err);
			}); */

		if (isNaN(dices) || (dices <= 0 && dices > 7)) {
			return message.reply('Tienes que introducir un número de dados válido [1-6]');
		}

		if (isNaN(bet)) {
			return message.reply('La cantidad de la apuesta tiene que ser un número');
		}

		if (isNaN(guessNum) || (guessNum <= 0 && guessNum > 11)) {
			return message.reply('El número de dados tiene que ser un número [1-10]');
		}


		/*if (tokens < bet) {
			return message.reply(bot.lang.C_MSG.DICE_NOT_ENOUGH_TOKENS.replace('{{tokens}}', tokens));
		}
	
		bot.db.modTokens(bot, message.author.id, -bet);*/

		for (let i = 1; i <= dices; i++) {
			const generateNumber = Math.ceil(Math.random() * 6);
			if (generateNumber == guessNum) {
				wins++;
			}

			switch (generateNumber) {
				case 1:
					output += ' :one: ';
					break;

				case 2:
					output += ' :two: ';
					break;

				case 3:
					output += ' :three: ';
					break;

				case 4:
					output += ' :four: ';
					break;

				case 5:
					output += ' :five: ';
					break;

				case 6:
					output += ' :six: ';
					break;
			}
		}

		if (wins == 0) {
			result = 'No has ganado ninguna tirada';
		} else if (wins == 1) {
			result = `Has ganado una vez\nTokens ganados: ${bet * (config.betRatio * 1)}`;
			//bot.db.modTokens(bot, message.author.id, bet);
			//bot.db.modTokens(bot, message.author.id, bet * (bot.config.betRatio * 1));
		} else {
			result = `Has ganado ${wins} tiradas\nTokens ganados: ${bet * (config.betRatio * wins)}`
			//bot.db.modTokens(bot, message.author.id, bet);
			//bot.db.modTokens(bot, message.author.id, bet * (bot.config.betRatio * wins));
		}

		const embed = {
			title: 'Resultado(s) de la(s) apuesta(s)',
			description: output,
			color: util.randomColor(),
			footer: {
				text: result,
			},
			thumbnail: {
				url: message.author.avatarURL({ dynamic: true, format: 'png' }),
			},
		};

		message.channel.send({ embed });
	}
}