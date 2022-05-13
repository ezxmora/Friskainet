module.exports = {
  name: 'resume',
  description: 'Continua lo que estaba sonando en el bot',
  category: 'music',
  cooldown: 2,
  run: async (interaction) => {
    await interaction.deferReply();
    const { voiceConnections } = interaction.client;
    const voiceChannel = interaction.member?.voice.channel;
    const connectionExists = voiceConnections.get(interaction.guildId);

    if (!voiceChannel) return interaction.editReply({ content: 'Tienes que estar en un canal de voz' });

    if (connectionExists) {
      connectionExists.audioPlayer.unpause();
      return interaction.editReply({ content: 'El reproductor ya no está pausado' });
    }

    return interaction.editReply({ content: 'No hay nada sonando' });
  },
};
