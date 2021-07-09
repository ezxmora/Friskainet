const fetch = require('node-fetch');

module.exports = {
  name: 'boobs',
  description: 'Envía una foto de unos pechos',
  category: 'nsfw',
  args: false,
  cooldown: 5,
  run: async (message) => {
    const { util } = message.client;

    if (!message.member.roles.cache.some((r) => r.name === 'NSFW')) {
      return message.reply('No tienes permisos para usar este comando');
    }

    if (!message.channel.nsfw) return message.reply('No puedes usar este comando aquí');

    return fetch('http://api.oboobs.ru/boobs/0/1/random')
      .then((res) => res.json())
      .then((json) => {
        const embed = {
          color: util.randomColor(),
          timestamp: `${message.createdAt}`,
          image: {
            url: `http://media.oboobs.ru/${json[0].preview}`,
          },
        };
        message.channel.send({ embed });
      });
  },
};
