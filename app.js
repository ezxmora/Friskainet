process.title = 'Friskainet';

const { Intents, Options } = require('discord.js');
const Friskainet = require('./classes/bot/Friskainet');
const { token } = require('./resources/config');

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

bot.login(token);
