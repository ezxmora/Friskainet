const { Client, Collection } = require('discord.js');
const { createAudioPlayer } = require('@discordjs/voice');

const Loader = require('./Loader');
const EventLoader = require('./EventLoader');
const JobLoader = require('./JobLoader');

const config = require('../resources/config');
const database = require('../libs/database');
const logger = require('../libs/logger');
const util = require('../libs/utils');
const voice = require('../libs/voice');

module.exports = class Friskainet extends Client {
  constructor(options = {}) {
    super(options);

    this.commands = new Loader(this, 'commands');
    this.commandCooldowns = new Collection();
    this.config = config;
    this.database = database;
    this.events = new EventLoader(this);
    this.jobs = new JobLoader(this);
    this.logger = logger;
    this.util = util;
    this.voiceLib = voice;
    this.voicePlayer = createAudioPlayer();
  }

  async login(token) {
    await Promise.all([
      this.commands.loadFiles(),
      this.events.loadFiles(),
      this.jobs.loadFiles(),
      super.login(token),
    ]);
  }

  getAllUsers() {
    return this.config.guilds.reduce(async (i, guild) => {
      const currentGuild = await this.guilds.fetch(guild);
      const guildMembers = await currentGuild.members.fetch();
      return guildMembers.filter((member) => !member.user.bot);
    }, 0);
  }
};
