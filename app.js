process.title = 'Friskainet';
// Shitty trick for getting the main folder ¯\_(ツ)_/¯
global.basedir = __dirname;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('./classes/extenders/GuildMember');
const { Intents } = require('discord.js');
const Friskainet = require('./classes/Friskainet');
const { discordToken } = require('./resources/config');

const bot = new Friskainet({ intents: Intents.ALL, disableMentions: 'everyone' });

bot.login(discordToken);
