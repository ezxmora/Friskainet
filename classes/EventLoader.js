const FileLoader = require('./Loader');

module.exports = class EventLoader extends FileLoader {
  constructor(client) {
    super(client, 'events');
  }

  set(eventName, file) {
    super.set(eventName, file);

    if (file.once) {
      this.client.once(eventName, (...args) => file.execute(...args, this.client));
    }
    else {
      this.client.on(eventName, (...args) => file.execute(...args, this.client));
    }

    return eventName;
  }
};
