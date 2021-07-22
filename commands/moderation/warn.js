module.exports = {
  name: 'warn',
  description: 'Le añade un warn a un usuario',
  category: 'moderation',
  args: true,
  permissions: 'ADMINISTRATOR',
  usage: '<Usuario> <Motivo>',
  run: async (message, args) => {
    const { database: { Warn }, logger } = message.client;
    const user = message.mentions.members.first();
    const reason = args.slice(1).join(' ');
    const userExists = await user.info;

    if (!userExists) return message.reply({ content: 'Ese usuario no existe' });

    return Warn.create({ userId: userExists.userId, reason })
      .then((warn) => logger.db(`${user.user.tag} ha recibido un warn, motivo: ${warn.reason}`))
      .catch((err) => logger.error(err));
  },
};
