const wait = require('util').promisify(setTimeout);
const {
  createAudioPlayer,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  VoiceConnectionDisconnectReason,
  entersState,
} = require('@discordjs/voice');

module.exports = class SoundPlayer {
  constructor(voiceConnection) {
    this.queue = [];
    this.voiceConnection = voiceConnection;
    this.audioPlayer = createAudioPlayer();
    this.queueLock = false;
    this.readyLock = false;
    this.timer = null;

    this.voiceConnection.on('stateChange', async (_, newState) => {
      if (newState.status === VoiceConnectionStatus.Disconnected) {
        // If the bot gets kicked it won't reconnect, if it gets moved it will retry it
        if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose
          && newState.closeCode === 4014) {
          try {
            await entersState(this.voiceConnection, VoiceConnectionStatus.Connecting, 5000);
          }
          catch {
            this.voiceConnection.destroy();
          }
        }
        else if (this.voiceConnection.rejoinAttempts < 5) {
          // Tries to reconnect
          await wait((this.voiceConnection.rejoinAttempts + 1) * 5000);
          this.voiceConnection.rejoin();
        }
        else {
          this.voiceConnection.destroy();
        }
      }
      else if (newState.status === VoiceConnectionStatus.Destroyed) {
        this.stop();
      }
      else if (!this.readyLock
        && (newState.status === VoiceConnectionStatus.Connecting
          || newState.status === VoiceConnectionStatus.Signalling)) {
        this.readyLock = true;
        try {
          await entersState(this.voiceConnection, VoiceConnectionStatus.Ready, 15000);
        }
        catch {
          if (this.voiceConnection.state.status
            !== VoiceConnectionStatus.Destroyed) this.voiceConnection.destroy();
        }
        finally {
          this.readyLock = false;
        }
      }
    });

    this.audioPlayer.on('stateChange', (oldState, newState) => {
      if (newState.status === AudioPlayerStatus.Idle
        && oldState.status !== AudioPlayerStatus.Idle) {
        this.timer = null;
        this.processQueue();
      }
      else if (newState.status === AudioPlayerStatus.Playing) {
        newState.resource.metadata.onStart();
      }
      else if (newState.status === AudioPlayerStatus.Idle
        && oldState.status === AudioPlayerStatus.Idle) {
        this.timer = setTimeout(() => voiceConnection.destroy(), 30_000);
      }
    });

    this.audioPlayer.on('error', (error) => error.resource.metadata.onError(error));

    voiceConnection.subscribe(this.audioPlayer);
  }

  async processQueue() {
    if (this.queueLock
      || this.audioPlayer.state.status !== AudioPlayerStatus.Idle
      || this.queue.length === 0) {
      return;
    }

    this.queueLock = true;

    const nextTrack = this.queue.shift();

    try {
      const resource = await nextTrack.createAudioResource();
      this.audioPlayer.play(resource);
      this.queueLock = false;
    }
    catch (error) {
      nextTrack.onError(error);
      this.queueLock = false;
      this.processQueue();
    }
  }

  enqueue(track) {
    this.queue.push(track);
    this.processQueue();
  }

  stop() {
    this.audioPlayer.stop(true);
    this.queue = [];
    this.queueLock = true;
  }
};
