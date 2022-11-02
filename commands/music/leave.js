module.exports = {
  name: 'leave',
  description: 'Hace que el bot se vaya del canal de voz',
  category: 'music',
  cooldown: 0,
  run: async (interaction) => {
    await interaction.deferReply();
    const { player, logger } = interaction.client;
    const voiceChannel = interaction.member?.voice.channel;
    const connection = player.getQueue(interaction.guildId);

    if (!voiceChannel) return interaction.reply({ content: 'No estás en un canal de voz' });

    if (connection && interaction.guild.members.me.voice.channelId === voiceChannel.id) {
      // Bot and user are in the same channel
      player.voices.leave(interaction);
      interaction.editReply({ content: `He abandonado el canal de voz **${voiceChannel.name}**` });
      return logger.log(`He abandonado el canal de voz ${voiceChannel.name} (${voiceChannel.id})`);
    }
    return interaction.editReply({ content: 'No estamos en el mismo canal de voz :(' });
  },
};
