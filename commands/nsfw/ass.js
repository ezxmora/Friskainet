const fetch = require('node-fetch');

module.exports = {
  name: 'ass',
  description: 'Envía una foto de un culo',
  category: 'nsfw',
  cooldown: 5,
  run: async (interaction) => {
    const { util } = interaction.client;

    if (!interaction.member.roles.cache.some((r) => r.name === 'NSFW')) {
      return interaction.reply({ content: 'No tienes permisos para usar este comando' });
    }

    if (!interaction.channel.nsfw) return interaction.reply({ content: 'No puedes usar este comando aquí' });

    return fetch('http://api.obutts.ru/butts/0/1/random')
      .then(async (response) => {
        const responseJson = await response.json();

        interaction.reply({
          embeds: [{
            color: util.randomColor(),
            timestamp: interaction.createdAt,
            image: {
              url: `http://media.obutts.ru/${responseJson[0].preview}`,
            },
          }],
        });
      });
  },
};
