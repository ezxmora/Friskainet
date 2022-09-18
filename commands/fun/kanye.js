const { resolveColor } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'kanye',
  description: 'Devuelve una frase de Kanye West',
  category: 'fun',
  cooldown: 5,
  run: async (interaction) => {
    const { util: { randomColor } } = interaction.client;

    return fetch('https://api.kanye.rest')
      .then(async (response) => {
        const jsonResponse = await response.json();
        interaction.reply({
          embeds: [{
            color: resolveColor(randomColor()),
            title: 'Kanye dijo una vez...',
            description: `_“${jsonResponse.quote}”_`,
            timestamp: interaction.createdAt,
            footer: { text: '🌊' },
          }],
        });
      });
  },
};
