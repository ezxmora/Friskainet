module.exports = {
  name: 'messageReactionAdd',
  once: false,
  execute: async (reaction, user, bot) => {
    if (reaction.emoji.name === '📌') {
      // Message might not be cached, so we fetch it
      if (reaction.partial) {
        try {
          await reaction.fetch();
        }
        catch (err) {
          console.log(`Ha habido un error al cachear el mensaje, ${err}`);
          return;
        }
      }

      const serverOwner = await reaction.message.guild.fetchOwner();

      if (reaction.count >= 2 || serverOwner.user.id === user.id) {
        const channel = await reaction.message.guild.channels.cache.find((c) => c.name === bot.config.channels.pinneds);

        const embedPin = {
          color: '#FF0000',
          author: {
            name: reaction.message.author.tag,
            icon_url: reaction.message.author.avatarURL({ dynamic: true, format: 'png' }),
          },
          description: `${reaction.message.content} [...ir al mensaje](${reaction.message.url})`,
          footer: { text: '📌' },
          timestamp: new Date(reaction.message.createdTimestamp),
        };

        if (reaction.message.attachments.first()) {
          if (['image/jpeg', 'image/png', 'image/gif'].includes(reaction.message.attachments.first().contentType)) {
            embedPin.image = {
              url: reaction.message.attachments.first().url,
            };
          }
        }

        channel.send({ embeds: [embedPin] });
      }
    }
  },
};
