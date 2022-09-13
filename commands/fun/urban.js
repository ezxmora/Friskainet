const urban = require('urban');

module.exports = {
  name: 'urban',
  description: 'Hace una búsqueda en UrbanDictionary',
  category: 'fun',
  cooldown: 5,
  run: async (interaction) => {
    const { util: { randomColor } } = interaction.client;
    const query = interaction.options.getString('termino');

    await urban(query).first((response) => {
      if (!response) return interaction.reply({ content: 'No he encontrado nada' });

      const description = response.definition;

      const embed = {
        title: response.word,
        description: description.replace(/[[\]']+/g, ''),
        url: response.permalink,
        color: randomColor(),
        footer: {
          icon_url: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/180/thumbs-up-sign_1f44d.png',
          text: `Likes: ${response.thumbs_up}`,
        },
        thumbnail: {
          url: interaction.client.user.avatarURL({ dynamic: true, format: 'png' }),
        },
        author: {
          name: response.author,
        },
      };
      return interaction.reply({ embeds: [embed] });
    });
  },
};
