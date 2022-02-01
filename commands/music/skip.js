module.exports = {
  name: 'skip',
  description: 'Salta la canción que está sonando',
  category: 'music',
  cooldown: 2,
  run: async (interaction) => {
    const { voiceConnections } = interaction.client;
    const voiceChannel = interaction.member?.voice.channel;
    const connectionExists = voiceConnections.get(interaction.guildId);

    if (!voiceChannel) return interaction.reply({ content: 'Tienes que estar en un canal de voz' });

    if (connectionExists) {
      connectionExists.audioPlayer.stop();
      await interaction.reply({ content: 'Se ha saltado la canción' });
    }

    return interaction.reply({ content: 'No hay nada sonando' });
  },
};
