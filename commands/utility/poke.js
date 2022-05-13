module.exports = {
  name: 'poke',
  description: 'Manda un DM a un usuario con un mensaje',
  options: [{
    name: 'usuario',
    type: 'USER',
    description: 'Usuario al que pokear',
    required: true,
  },
  {
    name: 'mensaje',
    type: 'STRING',
    description: 'Mensaje a enviar',
    required: false,
  }],
  category: 'utility',
  run: async (interaction) => {
    const { logger, util } = interaction.client;
    const userMention = interaction.options.getMember('usuario');
    const clientMessage = interaction.options.getString('mensaje') || 'Sin mensaje';

    if (clientMessage.length > 2001) return interaction.reply({ content: 'El mensaje es demasiado largo, máximo 2000 caracteres' });

    try {
      const embed = {
        title: `${interaction.user.tag} te ha pokeado`,
        description: clientMessage,
        color: util.randomColor(),
        timestamp: interaction.createdAt,
        thumbnail: {
          url: `${interaction.user.avatarURL({ dynamic: true, format: 'png' })}`,
        },
      };

      await userMention.send({ embeds: [embed] });

      return interaction.reply({ content: 'Se ha mandado el poke correctamente', ephemeral: true });
    }
    catch (error) {
      logger.error(`Ha habido un error al intentar pokear a ${userMention.tag}: \n${error.message}`);
      return interaction.reply({ content: 'Ha habido un error al pokear al usuario, puede que tenga los DMs deshabilitados' });
    }
  },
};
