process.title = 'Friskainet - Deploy script';

require('dotenv').config();
const { Intents } = require('discord.js');
const { mkdirSync, existsSync } = require('fs');
const Friskainet = require('./classes/bot/Friskainet');
const { discordToken } = require('./resources/config');
const { User, syncAll } = require('./libs/database/index');
const logger = require('./libs/logger');


const bot = new Friskainet({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

// Folder creation
if (!existsSync('./resources/voice')) {
  mkdirSync('./resources/voice');
  mkdirSync('./resources/voice/join');
  mkdirSync('./resources/voice/leave');
  mkdirSync('./resources/voice/say');
}

if (!existsSync('./resources/tmp')) {
  mkdirSync('./resources/tmp');
}

const init = async () => {
  // Database and slash commands deployment
  syncAll(async () => {
    const commands = await bot.commands.loadFiles();
    const guilds = await bot.guilds.cache.map((guild) => guild.id);

    // Fetchs, removes and re-adds all Friskainet's commands
    await guilds.forEach(async (guild) => {
      const currentGuild = await bot.guilds.cache.get(guild);
      const currentGuildCommands = await currentGuild?.commands.fetch();

      await Promise.all(currentGuildCommands.map(async (command) => {
        await command.delete();
        logger.warn(`${command.name} ha sido borrado`);
      }));

      await currentGuild?.commands.set(commands)
        .then(() => logger.log('Se han añadido todos los comandos correctamente'))
        .catch((error) => logger.error(`Ha habido un error al intentar añadir un comando ${error}`));
    });

    // Fetchs and adds users to the database
    const users = await bot.getAllUsers();

    users.forEach((member) => {
      User.create({ userId: member.user.id })
        .then((result) => logger.db(`[${member.guild.name}] - [${result.userId}] - ${member.user.tag} ha sido añadid@ a la base de datos`))
        .catch((err) => logger.error(err));
    });
  });
};

bot.login(discordToken).then(() => init());
