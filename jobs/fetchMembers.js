module.exports = {
  name: 'fetchMembers',
  expression: '0 0 */1 * * *',
  run: async (bot) => {
    const guildMembers = await bot.getAllUsers();
    const online = guildMembers.filter((m) => !m.user.bot && m.presence?.status !== undefined);

    bot.database.Stat.update(
      { onlineUsers: online.size, totalUsers: guildMembers.size },
      { where: { server: bot.config.guildID } },
    );
  },
};
