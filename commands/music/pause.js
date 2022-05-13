module.exports = {
  name: 'pause',
  description: 'Pausa lo que está sonando actualmente en el bot',
  category: 'music',
  cooldown: 2,
  run: async (interaction) => {
    await interaction.deferReply();
    const { voiceConnections } = interaction.client;
    const voiceChannel = interaction.member?.voice.channel;
    const connectionExists = voiceConnections.get(interaction.guildId);

    if (!voiceChannel) return interaction.editReply({ content: 'Tienes que estar en un canal de voz' });

    if (connectionExists) {
      connectionExists.audioPlayer.pause();
      return interaction.editReply({ content: 'El reproductor está ahora pausado' });
    }

    return interaction.editReply({ content: 'No hay nada sonando' });
  },
};
