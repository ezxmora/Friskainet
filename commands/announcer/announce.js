module.exports = {
  name: 'announce',
  description: 'Invoca al bot a la sala de voz y hace que empiece a anunciar quien entra y sale de la sala',
  category: 'announce',
  args: false,
  cooldown: 0,
  run: async (message) => {
    const { logger } = message.client;
    if (!message.member.voice.channel) return message.reply('Tienes que estar en un canal de voz para invocarme');

    return message.member.voice.channel.join()
      .then((connection) => logger.log(`Me he unido al canal de voz ${connection.channel.name} (${connection.channel.id})`))
      .catch((error) => logger.error(`Ha habido un error al conectar a un canal de voz: ${error}`));
  },
};
