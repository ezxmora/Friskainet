module.exports = {
  name: 'voiceStateUpdate',
  once: false,
  execute: async (oldState, newState, bot) => {
    const { util: { randomColor }, config: { channels: { logs } } } = bot;
    // Ignore all bots
    if (newState.member.user.bot || oldState.member.user.bot) return;

    const logEmbed = {
      color: randomColor(),
    };
    // Ignores all the mute, deaf, stream, etc events
    if (oldState.channelId !== newState.channelId) {
      const channel = await bot.channels.cache.find((c) => c.name === logs);

      if (oldState.channelId === null) {
        logEmbed.thumbnail = { url: newState.member.user.avatarURL({ dynamic: true, format: 'png' }) };
        logEmbed.description = `**${newState.member.user.tag}** se ha unido a **${newState.channel.name}**`;
        channel.send({ embeds: [logEmbed] });
      }
      else if (newState.channelId === null) {
        logEmbed.thumbnail = { url: oldState.member.user.avatarURL({ dynamic: true, format: 'png' }) };
        logEmbed.description = `**${oldState.member.user.tag}** abandonó **${oldState.channel.name}**`;
        channel.send({ embeds: [logEmbed] });
      }
      else {
        logEmbed.thumbnail = { url: oldState.member.user.avatarURL({ dynamic: true, format: 'png' }) };
        logEmbed.description = `**${oldState.member.user.tag}** se movió a **${newState.channel.name}** desde **${oldState.channel.name}**`;
        channel.send({ embeds: [logEmbed] });
      }
    }
  },
};
