const { resolveColor } = require('discord.js');

module.exports = {
  name: 'shuffle',
  description: 'Baraja y divide en grupos una serie de elementos',
  category: 'utility',
  cooldown: 30,
  run: async (interaction) => {
    const { util: { chunk, shuffle, randomColor } } = interaction.client;
    const numberGroups = interaction.options.getInteger('grupos');
    const items = interaction.options.getString('items');

    if (numberGroups <= 0) return interaction.reply({ content: 'Tienes que introducir un número positivo' });

    const itemsToShuffle = await items.split(',').map((element) => element.trim());
    if (numberGroups > itemsToShuffle.length) return interaction.reply({ content: 'El número de grupos no puede ser mayor que el de items' });

    const chunkedAndShuffled = await chunk(shuffle(itemsToShuffle), numberGroups);

    const formattedGroups = {
      title: 'Shuffle',
      color: resolveColor(randomColor()),
      thumbnail: {
        url: interaction.client.user.avatarURL({ dynamic: true, format: 'png' }),
      },
      fields: [],
    };

    for (let i = 0; i < chunkedAndShuffled.length; i++) {
      const aux = { name: '', value: '' };
      aux.name = `**Grupo ${i + 1}**`;
      for (let j = 0; j < chunkedAndShuffled[i].length; j++) {
        if (chunkedAndShuffled[i].length !== j + 1) {
          aux.value += `${chunkedAndShuffled[i][j]} - `;
        }
        else {
          aux.value += `${chunkedAndShuffled[i][j]}\n`;
        }
      }
      formattedGroups.fields.push(aux);
    }

    return interaction.reply({ embeds: [formattedGroups] });
  },
};
