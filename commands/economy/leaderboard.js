module.exports = {
  name: 'leaderboard',
  description: 'Muestra el top 3 de las personas más ricas del servidor',
  category: 'economy',
  args: false,
  cooldown: 15,
  run: async (message) => {
    const medals = ['🥇', '🥈', '🥉'];
    const { database, util } = message.client;
    const topUsers = await database.User.findAll({ limit: 3, order: [['balance', 'DESC']] });
    const embed = {
      color: util.randomColor(),
      title: 'Usuarios más ricos del servidor',
      fields: [],
    };

    await topUsers.forEach(async (user, iterator) => {
      const userData = message.guild.members.cache.get(user.discordID);
      embed.fields.push({ name: `${medals[iterator]} ${userData.user.tag}`, value: `${user.balance} tokens` });

      if (iterator === 0) {
        embed.thumbnail = { url: userData.user.avatarURL({ dynamic: true, format: 'png' }) };
      }
    });

    message.reply({ embeds: [embed] });
  },
};
