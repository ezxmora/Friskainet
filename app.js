process.title = 'Friskainet';

require('dotenv').config();
require('module-alias/register');
const { Options, GatewayIntentBits, Partials } = require('discord.js');
const Friskainet = require('@bot/Friskainet');
const { token } = require('@config');

const bot = new Friskainet({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  makeCache: Options.cacheWithLimits({
    MessageManager: 5000,
  }),
});

bot.login(token);
