const { userJoined, userLeft } = require('../libs/announcer');

const inChannel = (bot, channelID) => bot.voice.connections.some((con) => con.channel.id === channelID);

module.exports = {
  name: 'voiceStateUpdate',
  once: false,
  execute: async (oldState, newState, bot) => {
    // Ignore all bots
    if (newState.member.user.bot || oldState.member.user.bot) return;

    if (oldState.channelID !== newState.channelID) {
      if (inChannel(bot, newState.channelID)) {
        userJoined(newState);
      }
      else if (inChannel(bot, oldState.channelID)) {
        userLeft(oldState);
      }
    }
  },
};
