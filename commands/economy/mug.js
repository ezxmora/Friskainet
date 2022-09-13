module.exports = {
  name: 'mug',
  description: 'Roba o no algunos tokens a un usuario',
  category: 'economy',
  // 86400s are 24h
  cooldown: 86400,
  run: async (interaction) => {
    const { logger, util: { getRandomInt }, database: { sequelize } } = interaction.client;
    const user = interaction.options.getUser('usuario');

    if (user.bot) return interaction.reply({ content: 'No le puedes robar al bot' });

    if (user.id === interaction.member.id) return interaction.reply({ content: 'No te puedes robar a tí mism@' });

    if (Math.round(Math.random()) === 1) {
      const randomNumber = getRandomInt(5, 20);

      try {
        await sequelize.transaction(async (t) => {
          const sender = await interaction.client.userInfo(interaction.member.id);
          const receiver = await interaction.client.userInfo(user.id);

          await sender.decrement('balance', { by: randomNumber }, { transaction: t });
          await receiver.increment('balance', { by: randomNumber }, { transaction: t });
        });

        return interaction.reply({ content: `Le has robado ${randomNumber} tokens a ${user}` });
      }
      catch (error) {
        logger.db(`Haciendo rollback al robo entre ${user.tag} y ${interaction.member.user.tag}... ${error}`);
        return interaction.reply({ content: `Ha habido un error al intentar robar los tokens, ${randomNumber} tokens no se entregaron` });
      }
    }
    return interaction.reply({ content: `Te han descubierto y no has podido robarle a ${user}` });
  },
};
