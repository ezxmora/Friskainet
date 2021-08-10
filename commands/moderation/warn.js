const { Permissions } = require('discord.js');

module.exports = {
  name: 'warn',
  description: 'Le añade un warn a un usuario',
  options: [{
    name: 'usuario',
    type: 'USER',
    description: 'Usuario al que añadir el aviso',
    required: true,
  }, {
    name: 'motivo',
    type: 'STRING',
    description: 'Motivo por el que se sanciona al usuario',
    required: true,
  }],
  category: 'moderation',
  permissions: [Permissions.FLAGS.ADMINISTRATOR],
  run: async (interaction) => {
    const { database: { Warn }, logger } = interaction.client;
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('motivo');
    const userExists = await interaction.client.userInfo(user.id);

    if (!userExists) return interaction.reply({ content: 'Ese usuario no existe o es un bot' });

    return Warn.create({ userId: user.id, reason })
      .then((warn) => {
        logger.db(`${user.tag} ha recibido un warn, motivo: ${warn.reason}`);
        return interaction.reply(`Se ha creado el warn \`${warn.warnId}\``);
      })
      .catch((err) => logger.error(err));
  },
};
