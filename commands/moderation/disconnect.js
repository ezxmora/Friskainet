module.exports = {
  name: 'disconnect',
  description: 'Desconecta a un usuario de un canal de voz',
  category: 'moderation',
  permissions: 'MOVE_MEMBERS',
  args: true,
  usage: '<Mención al usuario> [Motivo]',
  run: async (message, args) => {
    const { logger } = message.client;

    if (!message.mentions.members.first()) return message.reply({ content: 'Necesitas especificar un usuario' });

    const member = message.mentions.members.first();

    return member.voice.kick(args.slice(0).join(' '))
      .then((userKicked) => logger.log(`${userKicked.user.tag} fue expulsado del canal de voz`))
      .catch((error) => logger.error(`Ha habido un error al expulsar el usuario:\n${error}`));
  },
};
