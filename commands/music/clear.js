module.exports = {
  name: 'clear',
  description: 'Vacía la cola de canciones',
  category: 'music',
  cooldown: 2,
  run: async (interaction) => {
    const { voiceConnections } = interaction.client;
    const voiceChannel = interaction.member?.voice.channel;
    const connectionExists = voiceConnections.get(interaction.guildId);

    if (!voiceChannel) return interaction.reply({ content: 'Tienes que estar en un canal de voz' });

    if (connectionExists) {
      connectionExists.queue = [];
      return interaction.reply({ content: 'La cola ha sido limpiada' });
    }

    return interaction.reply({ content: 'No hay nada en la cola' });
  },
};
