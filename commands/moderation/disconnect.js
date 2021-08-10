const { Permissions } = require('discord.js');

module.exports = {
  name: 'disconnect',
  description: 'Desconecta a un usuario de un canal de voz',
  options: [{
    name: 'usuario',
    type: 'USER',
    description: 'Usuario a desconectar',
    required: true,
  }],
  category: 'moderation',
  permissions: [Permissions.FLAGS.MOVE_MEMBERS],
  run: async (interaction) => {
    const { logger } = interaction.client;
    const user = interaction.options.getMember('usuario');

    try {
      user.voice.disconnect();
      logger.log(`${user.tag} fue expulsado del canal de voz`);
      return interaction.reply({ content: `${user} fue expulsado del canal de voz` });
    }
    catch (error) {
      logger.error(`Ha habido un error al expulsar el usuario:\n${error}`);
    }
  },
};
