process.title = 'Friskainet';
// Shitty trick for getting the main folder ¯\_(ツ)_/¯
global.basedir = __dirname;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { Intents, Options } = require('discord.js');
const Friskainet = require('./classes/bot/Friskainet');
const { discordToken } = require('./resources/config');

const bot = new Friskainet({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  makeCache: Options.cacheWithLimits({
    MessageManager: 5000,
  }),
});

bot.login(discordToken);
