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
    const quantity = !Number.isNaN(args.slice(1)) && Number.parseInt(args.slice(1), 10) > 0 ? Number.parseInt(args.slice(1), 10) : message.reply('El número introducido no es válido o no es un número positivo');

    if (!user) return message.reply('Necesitas mencionar a un usuario');

    if (!user.info) return message.reply('Ese no es un usuario válido');

    if (user.id === message.author.id) return message.reply('No te puedes transferir tokens a tí mism@');

    const result = await sequelize.transaction(async (t) => {
      await message.member.takeTokens(quantity);
      await user.giveTokens(quantity);
    });

    return message.reply(`Le transferiste ${quantity} tokens a ${user}`);
  },
};
