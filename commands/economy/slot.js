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
    const lines = !Number.isNaN(args[0]) ? Number.parseInt(args[0], 10) : message.reply('El valor introducido no es un número');

    if (lines % 2 === 0 || lines < 3 || lines > 9) return message.reply('El valor introducido no es un número válido, tiene que ser impar y entre 3 y 9 `(3, 5, 7 y 9)`');

    await message.member.takeTokens(10 * lines);
    const machine = new SlotMachine(lines, slotSymbols);
    const results = await machine.play();
    const wins = await results.lines.filter((line) => line.isWon);
    const points = await results.lines.reduce((acc, prize) => acc + prize.points, 0);
    await message.member.giveTokens(points);

    return message.reply({
      embed: {
        color: message.client.util.randomColor(),
        title: 'Resultados tragaperras',
        thumbnail: {
          url: message.author.avatarURL({ dynamic: true, format: 'png' }),
        },
        description: results.visualize(),
        footer: {
          text: wins.length > 0 ? `Has ganado ${wins.length} veces y ${points} tokens` : 'No has ganado ninguna vez',
        },
      },
    });
  },
};
