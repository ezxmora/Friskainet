module.exports = {
  name: 'announce',
  description: 'Invoca al bot a la sala de voz y hace que empiece a anunciar quien entra y sale de la sala',
  category: 'announcer',
  cooldown: 0,
  run: async (interaction) => {
    const { logger, voiceLib, voicePlayer } = interaction.client;
    const voiceChannel = interaction.member?.voice.channel;

    if (!voiceChannel) return interaction.reply({ content: 'Tienes que estar en un canal de voz para invocarme' });

    try {
      const connection = await voiceLib.connectToChannel(voiceChannel);
      connection.subscribe(voicePlayer);
      return interaction.reply({ content: 'Me estoy uniendo a tu canal de voz...' });
    }
    catch (error) {
      logger.error(`Ha habido un error al conectar a un canal de voz: ${error}`);
    }
  },
};
