const { Permissions } = require('discord.js');

module.exports = {
  name: 'delete',
  description: 'Borra los mensajes que cumplan cierto criterio',
  options: [{
    name: 'cantidad',
    type: 'INTEGER',
    description: 'Cantidad de mensajes a borrar',
    required: true,
  },
  {
    name: 'criterio',
    type: 'STRING',
    description: 'Criterio con el que se borrarán los mensajes, se pueden usar expresiones regulares',
    required: false,
  }],
  category: 'moderation',
  cooldown: 30,
  run: async (interaction) => {
    const { logger } = interaction.client;
    const numberMessages = interaction.options.getInteger('cantidad');
    const criteria = new RegExp(interaction.options.getString('criterio')?.toLowerCase() || /.*/);

    if (numberMessages > 100 || numberMessages <= 0) return interaction.reply({ content: 'Introduce un número válido de mensajes a borrar [1-100]' });

    return interaction.channel.messages.fetch({ limit: numberMessages })
      .then((messages) => {
        let filteredMsg = messages.map((msg) => msg.content.toLowerCase().match(criteria)
        && !msg.pinned && msg.author.id === interaction.user.id);

        if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
          filteredMsg = messages.filter((m) => m.content.toLowerCase().match(criteria) && !m.pinned);
        }

        return interaction.channel.bulkDelete(filteredMsg, true)
          .then((m) => {
            logger.warn(`${interaction.user.tag} ha borrado ${m.size} mensaje(s) con el contenido: ${criteria}`);
            return interaction.reply({ content: `Has borrado ${m.size} mensaje(s) con el contenido: \`${criteria}\`` });
          })
          .catch((error) => logger.error(error));
      })
      .catch((error) => logger.error(error));
  },
};
