'use strict';

const Discord = require('discord.js');
const bot = new Discord.Client();
const Enmap = require('enmap');
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Mongoose = require('mongoose');

bot.LogIt = require('./modules/LogIt');
bot.Discord = Discord;
bot.config = require('./config.json');
bot.commands = new Enmap();

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
	await Mongoose.connect(bot.config.database, { useNewUrlParser: true })
		.then(() => bot.LogIt.log('Conectado a la base de datos'))
		.catch(err => bot.LogIt.err(`Ha habido un error al conectar con la base de datos: ${err}`));

	// Log in the bot
	bot.login(bot.config.token);
};

init();
