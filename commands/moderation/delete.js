module.exports = {
  name: 'delete',
  description: 'Borra los mensajes que cumplan cierto criterio',
  category: 'moderation',
  args: true,
  usage: '<N. mensajes [1-100]> [Criterio]',
  cooldown: 30,
  run: async (message, args) => {
    const { logger } = message.client;
    const numberMessages = !Number.isNaN(args[0]) || args[0] > 100 || args[0] <= 0 ? Number.parseInt(args[0], 10) : message.reply('Introduce un número válido de mensajes a borrar [1-100]');
    const criteria = typeof args[1] === 'undefined' ? /.*/ : new RegExp(args.slice(1).join(' ').toLowerCase());

    await message.channel.messages.fetch({ limit: numberMessages })
      .then((msg) => {
        let filteredMessages = msg.filter((m) => m.content.toLowerCase().match(criteria)
        && !m.pinned
        && m.author.id === message.author.id);

        if (message.member.hasPermission('MANAGE_MESSAGES')) {
          filteredMessages = msg.filter((m) => m.content.toLowerCase().match(criteria)
          && !m.pinned);
        }
        message.channel.bulkDelete(filteredMessages, true)
          .then((m) => logger.warn(`${message.author.tag} ha borrado ${m.size} mensajes con el contenido: ${criteria}`))
          .catch((error) => logger.error(error));
      })
      .catch((error) => logger.error(error));
  },
};
