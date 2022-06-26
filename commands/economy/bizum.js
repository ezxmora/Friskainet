module.exports = {
  name: 'bizum',
  description: 'Envía tokens a otro usuario',
  category: 'economy',
  cooldown: 10,
  run: async (interaction) => {
    const { database: { sequelize }, logger } = interaction.client;
    const user = interaction.options.getUser('usuario');
    const quantity = interaction.options.getInteger('cantidad');

    if (user.bot) return interaction.reply({ content: 'No puedes mandarle tokens a un bot' });
    if (quantity <= 0) return interaction.reply({ content: 'La cantidad a enviar no puede ser negativa' });
    if (user.id === interaction.member.id) return interaction.reply({ content: 'No te puedes transferir tokens a tí mism@' });

    try {
      await sequelize.transaction(async (t) => {
        const sender = await interaction.client.userInfo(interaction.member.id);
        const receiver = await interaction.client.userInfo(user.id);

        await sender.decrement('balance', { by: quantity }, { transaction: t });
        await receiver.increment('balance', { by: quantity }, { transaction: t });
      });

      return interaction.reply({ content: `Le transferiste ${quantity} tokens a ${user}` });
    }
    catch (error) {
      logger.db(`Haciendo rollback de la transferencia entre ${user.tag} y ${interaction.member.user.tag}... ${error}`);
      return interaction.reply({ content: 'Ha habido un error al transferir tus tokens' });
    }
  },
};
