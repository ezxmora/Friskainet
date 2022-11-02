module.exports = {
  name: 'pause',
  description: 'Pausa lo que está sonando actualmente en el bot',
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
        queue.pause();
        return interaction.editReply({ content: 'El reproductor está ahora pausado' });
      }

      return interaction.editReply({ content: 'No estamos en el mismo canal de voz' });
    }
    return interaction.editReply({ content: 'No hay nada sonando' });
  },
};
