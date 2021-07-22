module.exports = {
  name: 'dice',
  description: 'Tira unos dados',
  category: 'economy',
  args: true,
  usage: '<N. dados [1-10]> <Apuesta> <N. adivinar [1-6]>',
  cooldown: 5,
  run: async (message, args) => {
    const { util, config, database } = message.client;
    const dices = args[0];
    const bet = args[1];
    const guessNum = args[2];
    let wins = 0;
    let output = '';
    let result = '';
    const user = await database.User.findOne({ where: { discordID: message.author.id } });
    const tokens = user.balance;

    if (Number.isNaN(dices) || (dices <= 0 && dices > 7)) return message.reply({ content: 'Tienes que introducir un número de dados válido [1-6]' });
    if (Number.isNaN(bet)) return message.reply({ content: 'La cantidad de la apuesta tiene que ser un número' });
    if (Number.isNaN(guessNum) || (guessNum <= 0 && guessNum > 11)) return message.reply({ content: 'El número de dados tiene que ser un número [1-10]' });
    if (Number.parseInt(tokens, 10) < bet * Number.parseInt(dices, 10)) return message.reply({ content: `No tienes suficientes tokens para hacer la apuesta. Tienes ${tokens} tokens` });

    // await user.decrement('balance', { by: bet * Number.parseInt(dices, 10) });

    for (let i = 1; i <= dices; i++) {
      const dicesTable = {
        1: ' :one: ',
        2: ' :two: ',
        3: ' :three: ',
        4: ' :four: ',
        5: ' :five: ',
        6: ' :six: ',
      };

      const generateNumber = Math.ceil(Math.random() * 6);
      if (generateNumber === Number.parseInt(guessNum, 10)) {
        wins += 1;
      }

      output += dicesTable[generateNumber];
    }

    if (wins === 0) {
      result = 'No has ganado ninguna tirada';
    }
    else if (wins === 1) {
      // result = `Has ganado una vez\nTokens ganados: ${bet * (config.betRatio * 1)}`;
      result = `Has ganado una vez\nTokens ganados: ${config.betRatio * ((1 ** 2) - 1)}`;
      // bot.db.modTokens(bot, message.author.id, bet);
      // bot.db.modTokens(bot, message.author.id, bet * (bot.config.betRatio * 1));
    }
    else {
      result = `Has ganado ${wins} tiradas\nTokens ganados: ${bet * (config.betRatio * wins)}`;
      // bot.db.modTokens(bot, message.author.id, bet);
      // bot.db.modTokens(bot, message.author.id, bet * (bot.config.betRatio * wins));
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

    return message.channel.send({ embeds: [embed] });
  },
};
