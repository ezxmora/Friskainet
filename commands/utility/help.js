module.exports = {
  name: 'help',
  description: 'Lista todos los comandos o información específica de uno',
  usage: '[Nombre del comando]',
  cooldown: 2,
  async run(message, args) {
    const {
      commands, config, logger, util,
    } = message.client;

    if (!args.length) {
      const embed = {
        color: util.randomColor(),
        title: 'Comandos del bot',
        description: commands.map((command) => `\`${command.name}\``).join(', '),
        footer: { text: `Prueba ${config.prefix}help [nombre del comando] para obtener información específica del mismo` },
      };

      return message.author.send({ embed })
        .then(() => message.reply('Te he mandado un DM con todos mis comandos'))
        .catch((error) => {
          logger.error(`No le he podido mandar un DM a ${message.author.tag}.\n${error}`);
          return message.reply('Parece que no te puedo mandar un DM. ¿Los tienes desactivados?');
        });
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name);

    if (!command) return message.reply('Ese no es un comando válido');

    const embed = {
      color: util.randomColor(),
      title: command.name,
      description: command.description,
      fields: [
        { name: 'Uso', value: `${config.prefix}${command.name} ${command.usage ? command.usage : ''}` },
        { name: 'Cooldown', value: `${command.cooldown || 3} segundo(s)` },
      ],
    };
    return message.channel.send({ embed, split: true });
  },
};
