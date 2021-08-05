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

  async userInfo(userId) {
    const { User, Warn } = this.database;
    const info = await User.findOne({ where: { userId }, include: { model: Warn, attributes: ['reason'] } });

    return info;
  }

  async giveTokens(userId, amount) {
    const userInfo = await this.userInfo(userId);
    const increment = await userInfo.increment('balance', { by: amount });

    return increment.balance;
  }

  async removeTokens(userId, amount) {
    const userInfo = await this.userInfo(userId);
    const decrement = (userInfo.balance <= 0)
      ? await userInfo.update({ balance: 0 }, { where: { userId } })
      : await userInfo.decrement('balance', { by: amount });

    return decrement.balance;
  }

  async giveExperience(userId, amount) {
    const userInfo = await this.userInfo(userId);
    const { experience, level } = userInfo;

    const nextLevel = level + 1;
    // Original D&D leveling formula
    const experienceNeeded = 500 * (nextLevel ** 2) - (500 * nextLevel);
    const totalExperience = amount + experience;
    const experienceExcess = totalExperience - experienceNeeded;

    if (totalExperience >= experienceNeeded) {
      if (experienceExcess >= 0) {
        const info = await userInfo.update({ experience: experienceExcess, level: nextLevel });
        return info;
      }

      const info = await userInfo.increment('level', { by: 1 });
      return info;
    }

    userInfo.increment('experience', { by: amount });
    return false;
  }
};
