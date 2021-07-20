module.exports = {
  name: 'leave',
  description: 'Hace que el bot se vaya del canal de voz',
  category: 'announcer',
  args: false,
  cooldown: 0,
  run: async (message) => {
    const bot = message.client;
    const userVoiceChan = message.member.voice.channel;
    const botVoiceConns = bot.voice.connections;
    if (!userVoiceChan) return message.reply({ content: 'No estás en un canal de voz', allowedMentions: { repliedUser: false } });

    // Bot and user are in the same channel
    const voiceChannel = botVoiceConns.find((current) => current.channel.id === userVoiceChan.id);
    if (voiceChannel) {
      voiceChannel.disconnect();
      return bot.logger.log(`He abandonado el canal de voz ${voiceChannel.channel.name} (${voiceChannel.channel.id})`);
    }
    return message.reply({ content: 'No estamos en el mismo canal de voz <:Sadge:824018458139295775>' });
  },
};
