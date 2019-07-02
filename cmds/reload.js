exports.run = async (bot, message, args) => {
	const modRole = message.guild.roles.find(role => role.name === bot.config.roleAdmin);
	if (!modRole) {
		return bot.LogIt.warn('El rol no existe en el servidor');
	}

	if (!message.member.roles.has(modRole.id)) return message.reply('No puedes usar este comando');

	if (!args || args.size < 1) {
		return message.reply('Tienes que dar el nombre de un comando para recargar');
	}
	const commandName = args[0];
	// Comprueba si el comando existe
	if (!bot.commands.has(commandName)) {
		return message.reply('Ese comando no existe');
	}
	// La ruta es relativa a este script
	delete require.cache[require.resolve(`./${commandName}.js`)];
	// También hay que recargar el comando en Enmap
	await bot.commands.delete(commandName);
	const props = require(`./${commandName}.js`);
	bot.commands.set(commandName, props);

	message.reply(`El comando ${commandName} ha sido recargado`);
	bot.LogIt.log(`El comando ${commandName} ha sido recargado`);
};
