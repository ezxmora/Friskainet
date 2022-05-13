const { SlotMachine } = require('slot-machine');
const { slotSymbols } = require('@resources/slots-symbols');

module.exports = {
  name: 'slot',
  description: 'Hace una tirada en la tragaperras',
  options: [{
    name: 'lineas',
    type: 'INTEGER',
    description: 'Cantidas de líneas para tirar en la tragaperras',
    required: true,
    choices: [
      { name: '3', value: 3 },
      { name: '5', value: 5 },
      { name: '7', value: 7 },
      { name: '9', value: 9 },
    ],
  },
  {
    name: 'apuesta',
    type: 'INTEGER',
    description: 'Cantidad a apostar',
    required: true,
  }],
  category: 'economy',
  cooldown: 0,
  run: async (interaction) => {
    const lines = interaction.options.getInteger('lineas');

    const userInfo = await interaction.client.userInfo(interaction.member.id);

    if (userInfo.balance > (lines * 10)) {
      await interaction.client.removeTokens(interaction.member.id, 10 * lines);
      const machine = new SlotMachine(lines, slotSymbols);
      const results = await machine.play();
      const wins = await results.lines.filter((line) => line.isWon);
      const points = await results.lines.reduce((acc, prize) => acc + prize.points, 0);
      await interaction.client.giveTokens(interaction.member.id, points);

      const embed = {
        color: interaction.client.util.randomColor(),
        title: 'Resultados de la tragaperras',
        thumbnail: {
          url: interaction.user.avatarURL({ dynamic: true, format: 'png' }),
        },
        description: results.visualize(),
        footer: {
          text: wins.length > 0 ? `Has ganado ${wins.length} veces y ${points} tokens` : 'No has ganado ninguna vez',
        },
      };

      return interaction.reply({ embeds: [embed] });
    }
    return interaction.reply({ content: `No tienes suficiente dinero para apostar, tienes ${userInfo.balance} tokens` });
  },
};
