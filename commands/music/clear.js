module.exports = {
  name: 'clear',
  description: 'Vacía la cola de canciones',
  category: 'music',
  cooldown: 2,
  run: async (interaction) => {
    const { player } = interaction.client;
    await interaction.deferReply();
    const voiceChannel = interaction.member?.voice.channel;
    const queue = player.getQueue(interaction.guildId);

    if (!voiceChannel) return interaction.editReply({ content: 'Tienes que estar en un canal de voz' });

    if (queue) {
      queue.songs = [queue.songs[0]];
      return interaction.editReply({ content: 'La cola ha sido limpiada' });
    }

    return interaction.editReply({ content: 'No hay nada en la cola' });
  },
};
