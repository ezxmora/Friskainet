const { userJoined, userLeft } = require('../libs/tts');

module.exports = {
  name: 'voiceStateUpdate',
  once: false,
  execute: async (oldState, newState, bot) => {
    const { voicePlayer, voiceLib: { channelId } } = bot;
    // Ignore all bots
    if (newState.member.user.bot || oldState.member.user.bot) return;

    // Ignores all the mute, deaf, stream, etc events
    if (oldState.channelId !== newState.channelId) {
      const botChannelId = await channelId(oldState.guild.id || newState.guild.id);

      if (!oldState.channelId || botChannelId === newState.channelId) {
        userJoined(newState, voicePlayer);
      }
      else if (botChannelId === oldState.channelId) {
        userLeft(oldState, voicePlayer);
      }
    }
  },
};
