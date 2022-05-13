const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const play = require('play-dl');
const Sound = require('../../classes/music/Sound');
const SoundPlayer = require('../../classes/music/SoundPlayer');
const Spotify = require('../../classes/music/Spotify');

module.exports = {
  name: 'play',
  description: 'Reproduce o añade una canción a la cola',
  options: [{
    name: 'cancion',
    type: 'STRING',
    description: 'La URL o título de la canción',
    required: true,
  }],
  category: 'music',
  cooldown: 2,
  run: async (interaction) => {
    const {
      logger,
      voiceConnections,
      util: { randomColor },
      config: { spotify: { clientId, clientSecret } },
    } = interaction.client;
    const voiceChannel = interaction.member?.voice.channel;
    let voiceConnection = voiceConnections.get(interaction.guildId);
    const song = interaction.options?.getString('cancion');
    await interaction.deferReply();

    if (!song) return interaction.reply({ content: 'Tienes que especificar una canción' });

    if (!voiceChannel) return interaction.reply({ content: 'Tienes que estar en un canal de voz' });

    if (!voiceConnection) {
      voiceConnection = new SoundPlayer(
        joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        }),
      );

      voiceConnection.voiceConnection.on('error', console.warn);
      voiceConnections.set(interaction.guildId, voiceConnection);

      try {
        await entersState(voiceConnection.voiceConnection, VoiceConnectionStatus.Ready, 15000);
      }
      catch (error) {
        logger.warn(error);
        return interaction.followUp('No he podido unirme al canal en 15 segundos, inténtalo de nuevo más tarde.');
      }
    }

    const soundFunctions = {
      onStart(track) {
        const minutes = Math.floor(track.duration / 60);
        const seconds = (track.duration - minutes * 60 < 10) ? `0${track.duration - minutes * 60}` : track.duration - minutes * 60;
        let songUrl;

        if (song.match(/^https?:\/\/(soundcloud\.com)\/(.*)$/)) {
          songUrl = song;
        }
        else if (song.match(/^https?:\/\/(open.spotify\.com)\/(.*)$/)) {
          songUrl = song;
        }
        else {
          songUrl = track.url;
        }

        interaction.followUp({
          embeds: [{
            color: randomColor(),
            author: {
              name: 'Está sonando:',
              icon_url: 'https://i.imgur.com/24gXH2p.gif',
            },
            description: `[${track.title}](${songUrl}) [${minutes}:${seconds}]`,
          }],
        }).catch(console.warn);
      },
      onError(error) {
        logger.warn(error);
        interaction.followUp({ content: `Error: ${error.message}` }).catch(console.warn);
      },
    };

    try {
      const youtubePlaylistPattern = /^.*(youtu.be\/|list=)([^#&?]*).*/;
      const spotifyAlbumPattern = /https?:\/\/(?:play\.|open\.)(spotify\.com\/album\/)((\w|-){22})/gm;
      const spotifyPlaylistPattern = /https?:\/\/(?:play\.|open\.)(spotify\.com\/playlist\/)((\w|-){22})/gm;

      // It's a Youtube playlist
      if (song.match(youtubePlaylistPattern)) {
        const { videos } = await play.playlist_info(song);

        videos.forEach((v) => {
          const track = Sound.create(v.url, soundFunctions);

          voiceConnection.enqueue(track);
        });

        return interaction.followUp(`Se han añadido ${videos.length} vídeos a la cola`);
      }

      // It's a Spotify album
      if (song.match(spotifyAlbumPattern)) {
        const spotify = new Spotify(clientId, clientSecret);
        await spotify.auth();

        const albumId = spotifyAlbumPattern.exec(song)[2];
        const tracks = await spotify.getAlbum(albumId);

        return Promise.all(tracks.map((t) => Sound.create(t.url, soundFunctions)))
          .then((music) => music.map(async (tr) => {
            await voiceConnection.enqueue(tr);
          }))
          .then((total) => interaction.followUp(`Se han añadido ${total.length} canciones a la cola`))
          .catch((e) => interaction.followUp(`Ha habido un error al intentar añadir las canciones\n \`\`\`${e}\`\`\``));
      }

      // It's a Spotify playlist
      if (song.match(spotifyPlaylistPattern)) {
        const spotify = new Spotify(clientId, clientSecret);
        await spotify.auth();

        const playlistId = spotifyPlaylistPattern.exec(song)[2];
        const tracks = await spotify.getPlaylist(playlistId);

        return Promise.all(tracks.map((t) => Sound.create(t.url, soundFunctions)))
          .then((music) => music.map(async (tr) => {
            await voiceConnection.enqueue(tr);
          }))
          .then((total) => interaction.followUp(`Se han añadido ${total.length} canciones a la cola`))
          .catch((e) => interaction.followUp(`Ha habido un error al intentar añadir las canciones\n \`\`\`${e}\`\`\``));
      }

      // Nothing matched the previous conditions
      // Attempts to create a track or list of tracks from the user's URL or string
      const track = await Sound.create(song, soundFunctions);
      // // Enqueue the track and reply a success message to the user
      voiceConnection.enqueue(track);
      await interaction.followUp(`Se ha añadido a la cola: **${track.title}**`);
    }
    catch (error) {
      logger.warn(error);
      return interaction.followUp('Ha habido un error al intentar añadir una canción, inténtalo más tarde');
    }
  },
};
