const { readdirSync } = require('fs');

module.exports = {
	name: 'reload',
	description: 'Recarga un comando',
	category: 'moderation',
	permissions: 'ADMINISTRATOR',
	args: true,
	usage: '<Nombre del comando>',
	run: async (message, args) => {
		const { LogIt } = message.client;
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName);

		if (!command) return message.reply(`No existe un comando con el nombre \`${commandName}\``);

		const commandFolder = readdirSync('./commands');
		const folderName = commandFolder.find((folder) => readdirSync(`./commands/${folder}`).includes(`${command.name}.js`));

		// Relative route from this script
		delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

		try {
			const newCommand = require(`../${folderName}/${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`El comando \`${newCommand.name}\` fue recargado`);
		} catch (error) {
			LogIt.error(`Ha habido un error recargando el comando:\n${error.message}`);
		}
	}
}