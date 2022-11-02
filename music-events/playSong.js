const { resolveColor } = require('discord.js');

module.exports = {
  name: 'playSong',
  once: false,
  execute: async (queue, song, bot) => {
    const { util: { randomColor } } = bot;

    queue.textChannel.send({
      embeds: [{
        color: resolveColor(randomColor()),
        author: {
          name: 'Está sonando:',
          icon_url: 'https://i.imgur.com/24gXH2p.gif',
        },
        description: `[${song.name}](${song.url})`,
      }],
    });
  },
};
