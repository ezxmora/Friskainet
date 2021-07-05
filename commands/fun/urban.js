const urban = require('urban');

module.exports = {
  name: 'urban',
  description: 'Hace una búsqueda en UrbanDictionary',
  category: 'fun',
  args: true,
  usage: '<Término a buscar>',
  cooldown: 5,
  run: async (message, args) => {
    const { util: { randomColor } } = message.client;
    const query = args.slice(0).join(' ');

    await urban(query).first((response) => {
      if (!response) return message.reply('No he encontrado nada');

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
          url: message.client.user.avatarURL({ dynamic: true, format: 'png' }),
        },
        author: {
          name: response.author,
        },
      };
      return message.reply({ embed });
    });
  },
};
