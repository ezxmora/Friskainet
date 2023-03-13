const { resolveColor } = require('discord.js');

module.exports = {
  name: 'messageReactionAdd',
  once: false,
  execute: async (reaction, user, bot) => {
    // Message or reaction might not be cached, so we fetch it
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    // Ignore bots
    if (user.bot) return;
    // Ignore reactions outside guilds
    if (!reaction.message.guild) return;

    const {
      config: {
        roleAssignerMessageId,
        channels: { pinneds },
        roles: { random, vip },
      },
    } = bot;

    // Message pinner
    if (reaction.emoji.name === '📌') {
      const pin = bot.database.Pin;
      const isPinned = await pin.findOne({
        where: {
          messageId: reaction.message.id,
        },
      });

      // We ommit messages that are already pinned
      if (isPinned?.pinned) return;

      const serverOwner = await reaction.message.guild.fetchOwner();

      if (reaction.count >= 3 || serverOwner.user.id === user.id) {
        const channel = await reaction.message.guild.channels.cache.find((c) => c.name === pinneds);

        const embedPin = {
          color: resolveColor('#FF0000'),
          author: {
            name: reaction.message.author.tag,
            icon_url: reaction.message.author.avatarURL({ dynamic: true, format: 'png' }),
          },
          description: `${reaction.message.content}\n\n[...ir al mensaje](${reaction.message.url})`,
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

        const pinnedMessage = await channel.send({ embeds: [embedPin] });
        pin.create({ pinId: pinnedMessage.id, messageId: reaction.message.id, pinned: true });
      }
    }

    // Regional indicators so people don't do the funny
    const regionalIndicatorRegex = /[\u{1F1E6}-\u{1F1FF}]/gu;
    if (regionalIndicatorRegex.test(reaction.emoji.name)) {
      await reaction.users.remove(user);
    }

    // Role assigner
    if (reaction.message.id === roleAssignerMessageId) {
      const [randomRole, vipRole] = reaction.message.guild.roles.cache.filter((r) => r.name === random || r.name === vip);

      if (reaction.emoji.name === '🔵') {
        await reaction.message.guild.members.cache.get(user.id).roles.add(randomRole);
        await reaction.users.remove(user);
      }

      if (reaction.emoji.name === '🟢') {
        await reaction.message.guild.members.cache.get(user.id).roles.add(vipRole);
        await reaction.users.remove(user);
      }
    }
  },
};
