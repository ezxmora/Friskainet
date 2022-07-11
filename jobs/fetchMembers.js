module.exports = {
  name: 'fetchMembers',
  expression: '* * */1 * * *',
  run: async (bot) => {
    const guildInfo = await bot.guilds.fetch(bot.config.guildID);
    const guildMembers = await guildInfo.members.fetch({ withPresences: true });
    const online = guildMembers.filter((m) => !m.user.bot && m.presence?.status !== undefined);

    bot.database.Stat.update(
      { onlineUsers: online.size, totalUsers: guildInfo.memberCount },
      { where: { server: bot.config.guildID } },
    );
  },
};
