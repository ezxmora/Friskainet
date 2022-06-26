module.exports = {
  name: 'dice',
  description: 'Tira unos dados',
  category: 'economy',
  cooldown: 5,
  run: async (interaction) => {
    const { util, config } = interaction.client;
    const dices = interaction.options.getInteger('dados');
    const bet = interaction.options.getInteger('apuesta');
    const guessNum = interaction.options.getInteger('cara');
    let wins = 0;
    let output = '';
    let result = '';
    const user = await interaction.client.userInfo(interaction.member.id);
    const tokens = user.balance;
    console.log(user.balance, bet * dices);

    if (tokens < bet * dices) return interaction.reply({ content: `No tienes suficientes tokens para hacer la apuesta. Tienes ${tokens} tokens` });

    // await interaction.client.removeTokens(interaction.member.id, bet * dices);

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
        url: interaction.user.avatarURL({ dynamic: true, format: 'png' }),
      },
    };

    return interaction.reply({ embeds: [embed] });
  },
};
