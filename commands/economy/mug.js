module.exports = {
  name: 'mug',
  description: 'Roba o no algunos tokens a un usuario',
  category: 'economy',
  args: true,
  usage: '<Usuario>',
  // 86400s are 24h
  cooldown: 86400,
  run: async (message) => {
    const user = message.mentions.members.first();

    if (!user) return message.reply({ content: 'Necesitas mencionar a un usuario' });
    if (user.id === message.author.id) return message.reply({ content: 'No te puedes robar a tí mism@' });

    if (Math.round(Math.random()) === 1) {
      const randomNumber = Math.floor(Math.random() * 10) + 1;

      await user.takeTokens(randomNumber);
      return message.reply({ content: `Le has robado ${randomNumber} tokens a ${user}` });
    }
    return message.reply({ content: `Te han descubierto y no has podido robarle a ${user}` });
  },
};
