const { Permissions } = require('discord.js');

module.exports = {
  name: 'warn',
  description: 'Le añade un warn a un usuario',
  category: 'moderation',
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
