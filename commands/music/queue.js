module.exports = {
  name: 'queue',
  description: 'Muestra la cola de canciones',
  category: 'music',
  cooldown: 2,
  run: async (interaction) => {
    await interaction.deferReply();
    const { voiceConnections, util: { randomColor } } = interaction.client;
    const connectionExists = voiceConnections.get(interaction.guildId);

    if (connectionExists) {
      const songs = [...connectionExists.queue];

      if (songs.length === 0) return interaction.editReply({ content: 'No hay nada en la cola' });

      const songTitle = connectionExists?.audioPlayer.state.resource?.metadata.title;
      const queue = await songs.map((song, index) => `${index + 1}. ${song.title}`).join('\n');
      const embedObject = {
        title: 'Cola de canciones',
        color: randomColor(),
        description: `**Está sonando: ** ${songTitle}\n**En la cola:\n**${queue}`,
      };
      return interaction.editReply({ embeds: [embedObject] });
    }

    return interaction.editReply({ content: 'No hay nada en la cola' });
  },
};
