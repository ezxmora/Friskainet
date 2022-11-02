module.exports = {
  name: 'skip',
  description: 'Salta la canción que está sonando',
  category: 'music',
  cooldown: 2,
  run: async (interaction) => {
    const { player } = interaction.client;
    await interaction.deferReply();
    const voiceChannel = interaction.member?.voice.channel;
    const queue = player.getQueue(interaction.guildId);

    if (!voiceChannel) return interaction.editReply({ content: 'Tienes que estar en un canal de voz' });

    if (queue) {
      if (interaction.guild.members.me.voice.channelId === voiceChannel.id) {
        if (queue.songs.length > 1) {
          await queue.skip();
        }
        else {
          await queue.stop();
        }

        return interaction.editReply({ content: 'Se ha saltado la canción' });
      }

      return interaction.editReply({ content: 'No estamos en el mismo canal de voz' });
    }
    return interaction.editReply({ content: 'No hay nada sonando' });
  },
};
