module.exports = {
  name: 'daily',
  description: 'Recibe la cantidad diaria de tokens',
  category: 'economy',
  // 86400 are 24h
  cooldown: 86400,
  run: async (interaction) => {
    const { logger } = interaction.client;
    const userInfo = await interaction.client.userInfo(interaction.member.id);
    if (!userInfo) return interaction.reply({ content: 'No se te ha encontrado en la base de datos, contacta con un administrador' });

    try {
      await interaction.client.giveTokens(interaction.member.id, 100);
      return interaction.reply({ content: 'Has canjeado tu bonus diario' });
    }
    catch (error) {
      logger.error(`Ha habido un error al repartir el bonus diario: ${error}`);
    }
  },
};
