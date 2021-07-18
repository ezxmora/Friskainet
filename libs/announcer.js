const { synth } = require('./tts');
const logger = require('./logger');

const play = async (bot, channelID, urlpath) => {
  const conn = bot.voice ? bot.voice.connections.find((vc) => vc.channel.id === channelID) : null;

  if (conn) {
    await conn.play(urlpath);
  }
  else {
    logger.log('No hay ninguna conexión establecida');
  }
};

module.exports = {
  userJoined: async (voiceState) => {
    const { member, channelID, guild } = voiceState;
    try {
      const path = await synth(`${member.user.username} se unió al canal`, `${global.basedir}/resources/voice/join/${member.id}.mp3`);
      play(guild.client, channelID, path);
    }
    catch (error) {
      logger.error(`Ha habido un error al procesar el audio de join de ${member.user.username} (${member.id}.mp3)\n${error}`);
    }
  },

  userLeft: async (voiceState) => {
    const { member, channelID, guild } = voiceState;
    try {
      const path = await synth(`${member.user.username} abandonó el canal`, `${global.basedir}/resources/voice/leave/${member.id}.mp3`);
      play(guild.client, channelID, path);
    }
    catch (error) {
      logger.error(`Ha habido un error al procesar el audio leave de ${member.user.username} (${member.id}.mp3)\n${error}`);
    }
  },
};
