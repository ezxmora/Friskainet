require('dotenv').config();
const { Client, Intents } = require('discord.js');
const { mkdirSync, existsSync, readdirSync } = require('fs');
const { discordToken } = require('./config');
const { User, syncAll, Experience } = require('../libs/database/index');
const logger = require('../libs/logger');


// const rest = new REST({ version: 9 }).setToken(discordToken);
const commandFolders = readdirSync('./commands/');
const commands = [];

commandFolders.forEach((folder) => {
  const cmds = readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));

  return cmds.forEach((command) => {
    const file = require(`../commands/${folder}/${command}`);

    const data = {
      name: file.name,
      description: file.description,
    };

    if (file.options) {
      data.options = file.options;
    }

    commands.push(data);
  });
});

const bot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

bot.once('ready', async () => {
  await bot.guilds.cache.each(async (guild) => {
    const memberList = await guild.members.cache;

    if (guild.available) {
      memberList.each((guildMember) => {
        if (!guildMember.user.bot) {
          User.create({ discordID: guildMember.user.id, birthday: null })
            .then((result) => {
              logger.db(`[${guild.name}] - ${guildMember.user.tag} ha sido añadido a la base de datos`);
              Experience.create({ userId: result.userId });
              // .catch((err) => logger.error(err));
            })
            .catch((err) => logger.error(err));
        }
      });
    }
  });

  // process.exit(0);
});

const init = async () => {
  if (!existsSync('./resources/voice')) {
    mkdirSync('./resources/voice');
    mkdirSync('./resources/voice/join');
    mkdirSync('./resources/voice/leave');
    mkdirSync('./resources/voice/say');
  }

  if (!existsSync('./resources/tmp')) {
    mkdirSync('./resources/tmp');
  }

  await syncAll(() => {
    bot.login(discordToken);
    bot.application?.commands.set([]);
  });
};

init();
