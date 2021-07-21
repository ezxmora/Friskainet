module.exports = {
  name: 'announce',
  description: 'Invoca al bot a la sala de voz y hace que empiece a anunciar quien entra y sale de la sala',
  category: 'announcer',
  args: false,
  cooldown: 0,
  run: async (message) => {
    const { logger, voiceLib, voicePlayer } = message.client;
    const voiceChannel = message.member?.voice.channel;

    if (!voiceChannel) return message.reply('Tienes que estar en un canal de voz para invocarme');

    try {
      const connection = await voiceLib.connectToChannel(voiceChannel);

      return connection.subscribe(voicePlayer);
    }
    catch (error) {
      console.log(error);
      logger.error(`Ha habido un error al conectar a un canal de voz: ${error}`);
    }
  },
};
