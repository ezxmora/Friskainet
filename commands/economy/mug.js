module.exports = {
  name: 'mug',
  description: 'Roba o no algunos tokens a un usuario',
  options: [{
    name: 'usuario',
    type: 'USER',
    description: 'Usuario al que robar',
    required: true,
  }],
  category: 'economy',
  // 86400s are 24h
  cooldown: 86400,
  run: async (interaction) => {
    const user = interaction.options.getUser('usuario');

    if (user.bot) return interaction.reply({ content: 'No le puedes robar al bot' });

    if (user.id === interaction.member.id) return interaction.reply({ content: 'No te puedes robar a tí mism@' });

    if (Math.round(Math.random()) === 1) {
      const randomNumber = Math.floor(Math.random() * 10) + 1;
      await interaction.client.removeTokens(user, randomNumber);
      await interaction.client.giveTokens(interaction.member.id, randomNumber);
      return interaction.reply({ content: `Le has robado ${randomNumber} tokens a ${user}` });
    }
    return interaction.reply({ content: `Te han descubierto y no has podido robarle a ${user}` });
  },
};
