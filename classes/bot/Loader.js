const { Collection } = require('discord.js');
const glob = require('fast-glob');
const path = require('path');
const logger = require('../../libs/logger');

module.exports = class FileLoader extends Collection {
  constructor(client, name) {
    super();

    this.client = client;
    this.name = name;
    this.dir = `${path.dirname(require.main.filename)}${path.sep}${name}`;
  }

  loadFile(file) {
    const filePath = path.join(this.dir, file);
    const loadedFile = require(filePath);

    try {
      const fileSetter = this.set(loadedFile.name, loadedFile);

      return fileSetter;
    }
    catch (error) {
      logger.error(`Ha fallado ${this.name.slice(0, -1)}\n${error.stack || error}`);

      return null;
    }
  }

  async loadFiles() {
    this.clear();
    await this.walkFiles();

    return this.map((v) => {
      const obj = {};

      obj.name = v.name;
      obj.description = v.description ?? null;

      if (Array.isArray(v.options)) {
        obj.options = v.options;
      }

      return obj;
    });
  }

  async walkFiles() {
    const files = await glob('**.js', { cwd: this.dir });

    return Promise.all(files.map((file) => this.loadFile(file)));
  }
};
