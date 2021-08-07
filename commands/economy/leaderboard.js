module.exports = {
  name: 'leaderboard',
  description: 'Muestra el top 3 de las personas más ricas del servidor',
  category: 'economy',
  cooldown: 15,
  run: async (interaction) => {
    const medals = ['🥇', '🥈', '🥉'];
    const { database, util } = interaction.client;
    const topUsers = await database.User.findAll({ limit: 3, order: [['balance', 'DESC']] });
    const embed = {
      color: util.randomColor(),
      title: 'Usuarios más ricos del servidor',
      fields: [],
    };

    await topUsers.forEach(async (user, iterator) => {
      const userData = await interaction.guild.members.fetch(user.userId);
      embed.fields.push({ name: `${medals[iterator]} ${userData.user.tag}`, value: `${user.balance} tokens` });

      if (iterator === 0) {
        embed.thumbnail = { url: userData.user.avatarURL({ dynamic: true, format: 'png' }) };
      }
    });

    interaction.reply({ embeds: [embed] });
  },
};
