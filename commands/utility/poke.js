module.exports = {
  name: 'poke',
  description: 'Manda un DM a un usuario con un mensaje',
  category: 'utility',
  args: true,
  usage: '<Mención al usuario> [Mensaje]',
  run: async (message, args) => {
    const { logger, util } = message.client;
    const userMention = message.mentions.members.first();
    const clientMessage = args.slice(1).join(' ');

    if (!userMention) return message.reply('Necesitas mencionar a un usuario');

    if (clientMessage.length > 2001) return message.reply('El mensaje es demasiado largo, máximo 2000 caracteres');

    try {
      const embed = {
        title: `${message.author.tag} te ha pokeado`,
        description: clientMessage,
        color: util.randomColor(),
        timestamp: message.createdAt,
        thumbnail: {
          url: `${message.author.avatarURL({ dynamic: true, format: 'png' })}`,
        },
      };

      return userMention.send({ embed });
    }
    catch (error) {
      logger.error(`Ha habido un error al intentar pokear a ${userMention.tag}: \n${error.message}`);
      return message.reply('Ha habido un error al pokear al usuario, puede que tenga los DMs deshabilitados');
    }
  },
};
