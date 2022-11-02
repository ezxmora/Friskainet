const { getBoobs, getButts } = require('@libs/apis/nsfw');
const { resolveColor } = require('discord.js');

module.exports = {
  name: 'nsfw',
  description: 'Envía imágenes nsfw',
  category: 'fun',
  cooldown: '5',
  run: async (interaction) => {
    const { util } = interaction.client;
    let url;

    if (!interaction.channel.nsfw) return interaction.reply({ content: 'No puedes usar este comando aquí' });

    if (interaction.options.getSubcommand() === 'ass') {
      const { preview } = await getButts();
      url = `http://media.obutts.ru/${preview}`;
    }
    else if (interaction.options.getSubcommand() === 'boobs') {
      const { preview } = await getBoobs();
      url = `http://media.oboobs.ru/${preview}`;
    }

    return interaction.reply({
      embeds: [{
        color: resolveColor(util.randomColor()),
        timestamp: interaction.createdAt,
        image: { url },
      }],
    });
  },
};
