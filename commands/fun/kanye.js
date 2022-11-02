const { resolveColor } = require('discord.js');
const { get } = require('@libs/apis/kanye');

module.exports = {
  name: 'kanye',
  description: 'Devuelve una frase de Kanye West',
  category: 'fun',
  cooldown: 5,
  run: async (interaction) => {
    const { util: { randomColor } } = interaction.client;
    const quote = await get();

    interaction.reply({
      embeds: [{
        color: resolveColor(randomColor()),
        title: 'Kanye dijo una vez...',
        description: `_“${quote}”_`,
        timestamp: interaction.createdAt,
        footer: { text: '🌊' },
      }],
    });
  },
};
