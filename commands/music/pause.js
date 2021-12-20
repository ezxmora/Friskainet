module.exports = {
  name: 'pause',
  description: 'Pausa lo que está sonando actualmente en el bot',
  category: 'music',
  cooldown: 2,
  run: async (interaction) => {
    const { voiceConnections } = interaction.client;
    const voiceChannel = interaction.member?.voice.channel;
    const connectionExists = voiceConnections.get(interaction.guildId);

    if (!voiceChannel) return interaction.reply({ content: 'Tienes que estar en un canal de voz' });

    if (connectionExists) {
      connectionExists.audioPlayer.pause();
      return interaction.reply({ content: 'El reproductor está ahora pausado' });
    }

    return interaction.reply({ content: 'No hay nada sonando' });
  },
};
