'use strict';

const Discord = require('discord.js');
const bot = new Discord.Client({
	disableEveryone: true,
	messageCacheMaxSize: 500,
	messageCacheLifetime: 120,
	messageSweepInterval: 60,
});
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Mongoose = require('mongoose');

bot.Discord = Discord;
bot.User = require('./modules/models/Users');
bot.Rules = require('./modules/models/Rules');
bot.LogIt = require('./modules/LogIt');
bot.config = require('./config.json');
bot.lang = require(`./resources/lang/${bot.config.lang}.json`);
bot.commands = new Discord.Collection();
bot.queue = new Discord.Collection();
bot.util = require('./modules/Utils');

const init = async () => {
	// Loading commands
	const cmds = await readdir('./cmds');
	bot.LogIt.log(`Cargando un total de ${cmds.length} comandos`);

	cmds.forEach(file => {
		if (!file.endsWith('.js')) return;
		const props = require(`./cmds/${file}`);
		const cmdName = file.split('.')[0];
		bot.commands.set(cmdName, props);
	});

	// Loading events
	const events = await readdir('./events');
	bot.LogIt.log(`Cargando un total de ${events.length} eventos`);

	events.forEach(file => {
		if (!file.endsWith('.js')) return;
		const event = require(`./events/${file}`);
		const eventName = file.split('.')[0];
		bot.on(eventName, event.bind(null, bot));
	});

	// Connection to the database
	await Mongoose.connect(bot.config.database, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => bot.LogIt.log('Conectado a la base de datos'))
		.catch(err => bot.LogIt.err(`Ha habido un error al conectar con la base de datos: ${err}`));

	// Log in the bot
	bot.login(bot.config.token);
};

init();


process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
