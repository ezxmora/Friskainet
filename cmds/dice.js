exports.run = async (bot, message, args) => {
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
		exports.help(bot, message);
		return message.reply(bot.lang.C_MSG.DICE_NOT_VALID_NUM);
	}

	if (isNaN(bet)) {
		exports.help(bot, message);
		return message.reply(bot.lang.C_MSG.DICE_NOT_VALID_QUANT);
	}

	if (isNaN(guessNum) || (guessNum <= 0 && guessNum > 11)) {
		exports.help(bot, message);
		return message.reply(bot.lang.C_MSG.DICE_NOT_VALID_DICES);
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
		result = bot.lang.C_MSG.DICE_LOST;
	}
	else if (wins == 1) {
		result = bot.lang.C_MSG.DICE_WIN_ONCE.replace('{{tokens}}', bet * (bot.config.betRatio * 1));
		//bot.db.modTokens(bot, message.author.id, bet);
		//bot.db.modTokens(bot, message.author.id, bet * (bot.config.betRatio * 1));
	}
	else {
		result = bot.lang.C_MSG.DICE_WIN_MULTI.replace('{{wins}}', wins);
		result = result.replace('{{profit}}', bet * (bot.config.betRatio * wins));
		//bot.db.modTokens(bot, message.author.id, bet);
		//bot.db.modTokens(bot, message.author.id, bet * (bot.config.betRatio * wins));
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

exports.help = async (bot, message) => {
	const embed = {
		color: ((1 << 24) * Math.random()) | 0,
		title: bot.lang.C_USAGE_TITLE,
		description: bot.lang.C_USAGE.DICE.replace('{{syntax}}', `${bot.config.prefix}dice`),
	};

	message.channel.send({ embed });
};