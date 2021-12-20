module.exports = {
  name: 'resume',
  description: 'Continua lo que estaba sonando en el bot',
  category: 'music',
  cooldown: 2,
  run: async (interaction) => {
    const { voiceConnections } = interaction.client;
    const voiceChannel = interaction.member?.voice.channel;
    const connectionExists = voiceConnections.get(interaction.guildId);

    if (!voiceChannel) return interaction.reply({ content: 'Tienes que estar en un canal de voz' });

    if (connectionExists) {
      connectionExists.audioPlayer.unpause();
      return interaction.reply({ content: 'El reproductor ya no está pausado' });
    }

    return interaction.reply({ content: 'No hay nada sonando' });
  },
};
