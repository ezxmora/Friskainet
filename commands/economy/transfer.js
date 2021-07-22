module.exports = {
  name: 'transfer',
  description: 'Envía tokens a otro usuario',
  category: 'economy',
  usage: '<Usuario> <Cantidad>',
  args: true,
  cooldown: 10,
  run: async (message, args) => {
    const { database: { sequelize } } = message.client;
    const user = message.mentions.members.first();
    let quantity = 0;

    if (!Number.isNaN(args.slice(1)) && Number.parseInt(args.slice(1), 10) > 0) {
      quantity = Number.parseInt(args.slice(1), 10);
    }
    else {
      return message.reply({ content: 'El número introducido no es válido o no es un número positivo' });
    }

    if (!user) return message.reply({ content: 'Necesitas mencionar a un usuario' });
    if (!user.info) return message.reply({ content: 'Ese no es un usuario válido' });
    if (user.id === message.author.id) return message.reply({ content: 'No te puedes transferir tokens a tí mism@' });

    const result = await sequelize.transaction(async (t) => {
      await message.member.takeTokens(quantity);
      await user.giveTokens(quantity);
    });

    return message.reply({ content: `Le transferiste ${quantity} tokens a ${user}` });
  },
};
