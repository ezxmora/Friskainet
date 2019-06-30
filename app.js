"use strict"

const Discord = require("discord.js")
const config = require("./config.json")
const bot = new Discord.Client()
const Enmap = require("enmap")
const { promisify } = require("util")
const readdir = promisify(require("fs").readdir)

bot.LogIt = require("./modules/LogIt")
bot.db = require("./modules/database")
bot.config = config
bot.commands = new Enmap()

const init = async () => {
	// Loading commands
	const cmds = await readdir("./cmds")
	bot.LogIt.log(`Cargando un total de ${cmds.length} comandos`)

	cmds.forEach(file => {
		if (!file.endsWith(".js")) return
		let props = require(`./cmds/${file}`)
		let cmdName = file.split(".")[0]
		bot.commands.set(cmdName, props)
	})

	// Loading events
	const events = await readdir("./events")
	bot.LogIt.log(`Cargando un total de ${events.length} eventos`)

	events.forEach(file => {
		if (!file.endsWith(".js")) return
		let event = require(`./events/${file}`)
		let eventName = file.split(".")[0]
		bot.on(eventName, event.bind(null, bot))
	})

	// Log in the bot
	bot.login(config.token)
}

init()
