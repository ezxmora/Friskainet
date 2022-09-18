const { resolveColor } = require('discord.js');

module.exports = {
  name: 'voiceStateUpdate',
  once: false,
  execute: async (oldState, newState, bot) => {
    const { config: { channels: { logs } } } = bot;
    // Ignore all bots
    if (newState.member.user.bot || oldState.member.user.bot) return;

    // Ignores all the mute, deaf, stream, etc events
    if (oldState.channelId !== newState.channelId) {
      const channel = await bot.channels.cache.find((c) => c.name === logs);

      if (oldState.channelId === null) {
        channel.send({
          embeds: [{
            color: resolveColor('#15FF00'),
            description: `[${newState.id}] - **${newState.member.user.tag}** se unió a **${newState.channel.name}**`,
          }],
        });
      }
      else if (newState.channelId === null) {
        channel.send({
          embeds: [{
            color: resolveColor('#FF0000'),
            description: `[${oldState.id}] - **${oldState.member.user.tag}** abandonó **${oldState.channel.name}**`,
          }],
        });
      }
      else {
        channel.send({
          embeds: [{
            color: resolveColor('#FF9900'),
            description: `[${oldState.id}] - **${oldState.member.user.tag}** se movió a **${newState.channel.name}** desde **${oldState.channel.name}**`,
          }],
        });
      }
    }
  },
};
