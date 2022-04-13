process.title = 'Friskainet - Deploy script';

const { Intents } = require('discord.js');
const Friskainet = require('./classes/bot/Friskainet');
const { token } = require('./resources/config');
const { User, syncAll } = require('./libs/database/index');


const bot = new Friskainet({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});


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
        bot.logger.warn(`${command.name} ha sido borrado`);
      }));

      await currentGuild?.commands.set(commands)
        .then(() => bot.logger.log('Se han añadido todos los comandos correctamente'))
        .catch((error) => bot.logger.error(`Ha habido un error al intentar añadir un comando ${error}`));
    });

    // Fetchs and adds users to the database
    const users = await bot.getAllUsers();

    users.forEach((member) => {
      User.create({ userId: member.user.id, birthday: null })
        .then((result) => bot.logger.db(`[${member.guild.name}] - [${result.userId}] - ${member.user.tag} ha sido añadid@ a la base de datos`))
        .catch((err) => bot.logger.error(err));
    });
  });
};

bot.login(token).then(() => init());
