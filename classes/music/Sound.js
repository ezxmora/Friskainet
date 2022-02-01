const { demuxProbe, createAudioResource } = require('@discordjs/voice');
const { raw } = require('youtube-dl-exec');
const play = require('play-dl');
const Spotify = require('./Spotify');
const { spotify } = require('../../resources/config');

// eslint-disable-next-line no-empty-function
const emptyFunction = () => {};

module.exports = class Sound {
  constructor({
    url, title, duration, onStart, onError,
  }) {
    this.url = url;
    this.title = title;
    this.duration = duration;
    this.onStart = onStart;
    this.onError = onError;
  }

  createAudioResource() {
    return new Promise((resolve, reject) => {
      const videoProcess = raw(this.url, {
        o: '-',
        q: '',
        f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
        r: '100K',
      },
      { stdio: ['ignore', 'pipe', 'ignore'] });

      if (!videoProcess.stdout) {
        reject(new Error('No stdout'));
        return;
      }

      const stream = videoProcess.stdout;
      const onError = (error) => {
        if (!videoProcess.killed) videoProcess.kill();
        stream.resume();
        reject(error);
      };

      videoProcess.once('spawn', () => {
        demuxProbe(stream)
          .then((probe) => {
            resolve(createAudioResource(probe.stream, { metadata: this, inputType: probe.type }));
          })
          .catch(onError);
      })
        .catch(onError);
    });
  }

  static async create(userInput, methods) {
    const soundcloudPattern = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const youtubePattern = /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?/gm;
    const spotifyPattern = /https?:\/\/(?:play\.|open\.)(spotify\.com\/track\/)((\w|-){22})/gm;

    const wrappedMethods = {
      onStart() {
        wrappedMethods.onStart = emptyFunction;
        methods.onStart(this);
      },
      onError(error) {
        wrappedMethods.onError = emptyFunction;
        methods.onError(error);
      },
    };

    // It's a Soundcloud track
    if (userInput.match(soundcloudPattern)) {
      const scInfo = await play.soundcloud(userInput);
      return new Sound({
        title: scInfo.name,
        url: scInfo.url,
        duration: scInfo.durationInSec,
        ...wrappedMethods,
      });
    }
    // It's a Spotify track
    if (userInput.match(spotifyPattern)) {
      const spotifyInstance = new Spotify(spotify.clientId, spotify.clientSecret);

      await spotifyInstance.auth();
      const trackId = spotifyPattern.exec(userInput)[2];
      const track = await spotifyInstance.getTrack(trackId);
      const ytInfo = await play.search(`${track.name} ${track.artists}`, { limit: 1 });
      return new Sound({
        title: `${track.name} - ${track.artists}`,
        url: ytInfo[0].url,
        duration: track.duration,
        ...wrappedMethods,
      });
    }
    // It's a Youtube track
    if (userInput.match(youtubePattern)) {
      const ytInfo = await play.video_info(userInput);
      return new Sound({
        title: ytInfo.video_details.title,
        url: ytInfo.video_details.url,
        duration: ytInfo.video_details.durationInSec,
        ...wrappedMethods,
      });
    }
    // It's a string
    const ytInfo = await play.search(userInput, { limit: 1 });
    return new Sound({
      title: ytInfo[0].title,
      url: ytInfo[0].url,
      duration: ytInfo[0].durationInSec,
      ...wrappedMethods,
    });
  }
};
