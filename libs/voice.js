const {
  getVoiceConnection,
  joinVoiceChannel,
  entersState,
  VoiceConnectionStatus,
  createAudioResource,
  StreamType,
  AudioPlayerStatus,
} = require('@discordjs/voice');

module.exports = {
  channelId: (guildId) => getVoiceConnection(guildId)?.joinConfig.channelId,

  connectToChannel: async (channel) => {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 30000);
      return connection;
    }
    catch (error) {
      connection.destroy();
      throw error;
    }
  },

  playSound: async (player, urlpath) => {
    const resource = createAudioResource(urlpath, { inputType: StreamType.Arbitrary });

    player.play(resource);

    return entersState(player, AudioPlayerStatus.Playing, 5000);
  },
};
