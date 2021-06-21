'use strict';
require('dotenv').config();
const { Client, Intents, Collection } = require('discord.js');
const { readdirSync } = require('fs');

const bot = new Client({
	intents: Intents.ALL/*[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]*/,
	disableMentions: 'everyone',
});
// const Mongoose = require('mongoose');

// bot.User = require('./modules/models/Users');
// bot.Rules = require('./modules/models/Rules');
bot.LogIt = require('./modules/LogIt');
bot.config = require('./resources/config');
// bot.lang = require(`./resources/lang/${bot.config.language}.json`);
bot.commands = new Collection();
bot.commandCooldowns = new Collection();
// bot.queue = new Discord.Collection();
bot.util = require('./modules/Utils');

const init = async () => {
	// Loading commands
	const commandFolders = readdirSync('./commands');
	let numberCommands = 0;
	let numberCategories = 0;

	for (const folder of commandFolders) {
		const commands = readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'))
		numberCategories = numberCategories + 1;
		for (const file of commands) {
			const command = require(`./commands/${folder}/${file}`);
			bot.commands.set(command.name, command);
			numberCommands = numberCommands + 1;
		}
	}

	bot.LogIt.log(`Caragando ${numberCommands} comandos en ${numberCategories} categorías`);
	// bot.LogIt.log(bot.util.replaceAll(bot.lang.SYS.LOADED_CMD, { '{{cmds}}': numberCommands, '{{categories}}': numberCategories }));

	// Loading events
	const events = readdirSync('./events').filter((file) => file.endsWith('.js'));

	for (const file of events) {
		const event = require(`./events/${file}`);
		if (event.once) {
			bot.once(event.name, (...args) => event.execute(...args, bot));
		} else {
			bot.on(event.name, (...args) => event.execute(...args, bot));
		}
	}

	bot.LogIt.log(`Cargando ${events.length} eventos`);

	// Connection to the database
	// await Mongoose.connect(bot.config.database, { useNewUrlParser: true, useUnifiedTopology: true })
	// 	.then(() => bot.LogIt.log('Conectado a la base de datos'))
	// 	.catch(err => bot.LogIt.err(`Ha habido un error al conectar con la base de datos: ${err}`));

	// Log in the bot
	bot.login(bot.config.discordToken);
};

init();

