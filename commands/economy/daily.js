module.exports = {
  name: 'daily',
  description: 'Recibe la cantidad diaria de tokens',
  category: 'economy',
  args: false,
  // 86400 are 24h
  cooldown: 86400,
  run: async (message) => {
    const { logger } = message.client;
    if (!message.member.info) return message.reply({ content: 'No se te ha encontrado en la base de datos, contacta con un administrador' });

    return message.member.giveTokens(100)
      .then(() => message.reply({ content: 'Has canjeado tu bonus diario.' }))
      .catch((err) => logger.error(err));
  },
};
