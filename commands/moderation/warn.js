module.exports = {
  name: 'warn',
  description: 'Le añade un warn a un usuario',
  category: 'moderation',
  args: true,
  permissions: 'ADMINISTRATOR',
  usage: '<Usuario> <Motivo>',
  run: async (message, args) => {
    const { database: { User, Warn }, logger } = message.client;
    const user = message.mentions.users.first();
    const reason = args.slice(1).join(' ');
    const userExists = await User.findOne({ where: { discordID: user.id } });

    if (!userExists) return message.reply('Ese usuario no existe');

    return Warn.create({
      userId: userExists.userId,
      reason,
    })
      .then((warn) => {
        logger.db(`${user.tag} ha recibido un warn, motivo: ${warn.reason}`);
      })
      .catch((err) => logger.error(err));
  },
};
