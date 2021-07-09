module.exports = {
  name: 'daily',
  description: 'Recibe la cantidad diaria de tokens',
  category: 'economy',
  args: false,
  // 86400 are 24h
  cooldown: 86400,
  run: async (message) => {
    const { database: { User }, logger } = message.client;
    const user = await User.findOne({ where: { discordID: message.author.id } });

    if (!user) return message.reply('No se te ha encontrado en la base de datos, contacta con un administrador');

    return user.increment('balance', { by: 100 })
      .then(() => message.reply('Has canjeado tu bonus diario.'))
      .catch((err) => logger.error(err));
  },
};
