const { SlotMachine } = require('slot-machine');
const { slotSymbols } = require('../../resources/slots-symbols');

module.exports = {
  name: 'slot',
  description: 'Hace una tirada en la tragaperras',
  category: 'economy',
  args: true,
  usage: '<N. líneas [3-9] impar>',
  cooldown: 0,
  run: async (message, args) => {
    let lines = 0;

    if (!Number.isNaN(args[0])) {
      lines = Number.parseInt(args[0], 10);
    }
    else {
      return message.reply({ content: 'El valor introducido no es un número' });
    }

    if (lines % 2 === 0 || lines < 3 || lines > 9) return message.reply({ content: 'El valor introducido no es un número válido, tiene que ser impar y entre 3 y 9 `(3, 5, 7 y 9)`' });

    const userInfo = await message.member.info;

    if (userInfo.balance > (lines * 10)) {
      await message.member.takeTokens(10 * lines);
      const machine = new SlotMachine(lines, slotSymbols);
      const results = await machine.play();
      const wins = await results.lines.filter((line) => line.isWon);
      const points = await results.lines.reduce((acc, prize) => acc + prize.points, 0);
      await message.member.giveTokens(points);

      const embed = {
        color: message.client.util.randomColor(),
        title: 'Resultados de la tragaperras',
        thumbnail: {
          url: message.author.avatarURL({ dynamic: true, format: 'png' }),
        },
        description: results.visualize(),
        footer: {
          text: wins.length > 0 ? `Has ganado ${wins.length} veces y ${points} tokens` : 'No has ganado ninguna vez',
        },
      };

      return message.reply({ embeds: [embed] });
    }
    return message.reply({ content: `No tienes suficiente dinero para apostar, tienes ${userInfo.balance} tokens` });
  },
};
