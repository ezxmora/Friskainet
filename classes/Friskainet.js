const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const cron = require('node-cron');
const config = require('../resources/config');
const database = require('../libs/database');
const logger = require('../libs/logger');
const util = require('../libs/utils');

module.exports = class Friskainet extends Client {
  constructor(options = {}) {
    super(options);

    this.commands = new Collection();
    this.commandCooldowns = new Collection();
    this.config = config;
    this.database = database;
    this.logger = logger;
    this.util = util;
  }

  async login(token) {
    // Loading commands
    const commandFolders = readdirSync('./commands');
    let numberCommands = 0;
    let numberCategories = 0;

    commandFolders.forEach((folder) => {
      const commands = readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));
      numberCategories += 1;

      commands.forEach((command) => {
        const file = require(`../commands/${folder}/${command}`);
        numberCommands += 1;
        this.commands.set(file.name, file);
      });
    });

    logger.log(`Cargando ${numberCommands} comandos en ${numberCategories} categorías`);

    // Loading events
    const events = await readdirSync('./events').filter((file) => file.endsWith('.js'));
    let numberEvents = 0;

    events.forEach((event) => {
      const file = require(`../events/${event}`);
      numberEvents += 1;
      if (event.once) {
        return this.once(file.name, (...args) => file.execute(...args, this));
      }
      return this.on(file.name, (...args) => file.execute(...args, this));
    });

    logger.log(`Cargando ${numberEvents} eventos`);

    // Loading cron-jobs
    const jobs = readdirSync('./jobs').filter((job) => job.endsWith('.js'));
    let numberJobs = 0;
    jobs.forEach((job) => {
      numberJobs += 1;
      const { expression, run } = require(`../jobs/${job}`);
      cron.schedule(expression, () => run(bot), { scheduled: true });
    });

    logger.log(`Cargando ${numberJobs} cron-jobs`);

    super.login(token);
  }
};
