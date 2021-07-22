module.exports = {
  name: 'leave',
  description: 'Hace que el bot se vaya del canal de voz',
  category: 'announcer',
  args: false,
  cooldown: 0,
  run: async (message) => {
    const { logger, voiceLib } = message.client;
    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) return message.reply({ content: 'No estás en un canal de voz' });

    const connection = voiceLib.connection(voiceChannel.guild.id);

    // Bot and user are in the same channel
    if (connection && voiceChannel.id === connection?.joinConfig.channelId) {
      connection.destroy();
      return logger.log(`He abandonado el canal de voz ${voiceChannel.name} (${voiceChannel.id})`);
    }
    return message.reply({ content: 'No estamos en el mismo canal de voz <:Sadge:824018458139295775>' });
  },
};
