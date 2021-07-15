process.title = 'Friskainet';
// Shitty trick for getting the main folder ¯\_(ツ)_/¯
global.basedir = __dirname;

require('dotenv').config();
require('./classes/extenders/GuildMember');
const { Intents } = require('discord.js');
const Friskainet = require('./classes/Friskainet');
const { discordToken } = require('./resources/config');

const bot = new Friskainet({ intents: Intents.ALL, disableMentions: 'everyone' });

bot.login(discordToken);
