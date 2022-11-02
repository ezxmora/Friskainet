module.exports = {
  name: 'play',
  description: 'Reproduce o añade una canción a la cola',
  category: 'music',
  cooldown: 2,
  run: async (interaction) => {
    const { player } = interaction.client;
    const voiceChannel = interaction.member?.voice.channel;
    const query = interaction.options?.getString('cancion');

    if (!query) return interaction.reply({ content: 'Tienes que especificar una canción' });
    if (!voiceChannel) return interaction.reply({ content: 'Tienes que estar en un canal de voz' });

    player.play(voiceChannel, query, {
      member: interaction.member,
      textChannel: interaction.channel,
    });

    return interaction.reply({ content: 'Se ha añadido la canción', ephemeral: true });
  },
};
