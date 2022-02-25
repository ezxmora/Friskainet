const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  name: 'leave',
  description: 'Hace que el bot se vaya del canal de voz',
  category: 'music',
  cooldown: 0,
  run: async (interaction) => {
    await interaction.deferReply();
    const { logger } = interaction.client;
    const voiceChannel = interaction.member?.voice.channel;
    if (!voiceChannel) return interaction.reply({ content: 'No estás en un canal de voz' });

    const connection = getVoiceConnection(voiceChannel.guild.id);

    // Bot and user are in the same channel
    if (connection && voiceChannel.id === connection?.joinConfig.channelId) {
      connection.destroy();
      interaction.editReply({ content: `He abandonado el canal de voz **${voiceChannel.name}**` });
      return logger.log(`He abandonado el canal de voz ${voiceChannel.name} (${voiceChannel.id})`);
    }
    return interaction.editReply({ content: 'No estamos en el mismo canal de voz :(' });
  },
};