const { SlotMachine } = require('slot-machine');
const { slotSymbols } = require('@resources/slots-symbols');
const { resolveColor } = require('discord.js');

module.exports = {
  name: 'slot',
  description: 'Hace una tirada en la tragaperras',
  category: 'economy',
  cooldown: 0,
  run: async (interaction) => {
    const { util } = interaction.client;
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
        color: resolveColor(util.randomColor()),
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
