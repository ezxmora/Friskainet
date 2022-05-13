module.exports = {
  name: 'skip',
  description: 'Salta la canción que está sonando',
  category: 'music',
  cooldown: 2,
  run: async (interaction) => {
    await interaction.deferReply();
    const { voiceConnections } = interaction.client;
    const voiceChannel = interaction.member?.voice.channel;
    const connectionExists = voiceConnections.get(interaction.guildId);

    if (!voiceChannel) return interaction.editReply({ content: 'Tienes que estar en un canal de voz' });

    if (connectionExists) {
      connectionExists.audioPlayer.stop();
      return interaction.editReply({ content: 'Se ha saltado la canción' });
    }

    return interaction.editReply({ content: 'No hay nada sonando' });
  },
};
