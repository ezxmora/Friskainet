const FileLoader = require('./Loader');

module.exports = class MusicEventLoader extends FileLoader {
  constructor(client, player) {
    super(client, 'music-events');
    this.player = player;
  }

  set(eventName, file) {
    super.set(eventName, file);

    if (file.once) {
      this.player.once(eventName, (...args) => file.execute(...args, this.client));
    }
    else {
      this.player.on(eventName, (...args) => file.execute(...args, this.client));
    }

    return eventName;
  }
};
