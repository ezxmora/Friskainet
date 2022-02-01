module.exports = {
  name: 'clear',
  description: 'Vacía la cola de canciones',
  category: 'music',
  cooldown: 2,
  run: async (interaction) => {
    await interaction.deferReply();
    const { voiceConnections } = interaction.client;
    const voiceChannel = interaction.member?.voice.channel;
    const connectionExists = voiceConnections.get(interaction.guildId);

    if (!voiceChannel) return interaction.editReply({ content: 'Tienes que estar en un canal de voz' });

    if (connectionExists) {
      connectionExists.queue = [];
      return interaction.editReply({ content: 'La cola ha sido limpiada' });
    }

    return interaction.editReply({ content: 'No hay nada en la cola' });
  },
};
