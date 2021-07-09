module.exports = {
  name: 'mug',
  description: 'Roba o no algunos tokens a un usuario',
  category: 'economy',
  args: true,
  usage: '<Usuario>',
  // 86400s are 24h
  cooldown: 86400,
  run: async (message) => {
    const { database: { User } } = message.client;
    const user = message.mentions.users.first();

    if (!user) return message.reply('Necesitas mencionar a un usuario');

    if (user.id === message.author.id) return message.reply('No te puedes robar a tí mism@');

    if (Math.round(Math.random()) === 1) {
      const mugged = await User.findOne({ where: { discordID: user.id } });

      const randomNumber = Math.floor(Math.random() * 10) + 1;

      mugged.decrement('balance', { by: randomNumber });
      return message.reply(`Le has robado ${randomNumber} tokens a ${user}`);
    }
    return message.reply(`Te han descubierto y no has podido robarle a ${user}`);
  },
};
