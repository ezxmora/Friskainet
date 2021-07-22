module.exports = {
  name: 'ready',
  once: true,
  execute(bot) {
    bot.logger.log(`${bot.user.tag} funcionando y sirviendo a ${bot.users.cache.size} usuarios`);
    bot.user.setPresence({
      activities: [{ name: bot.config.presence.name, type: bot.config.presence.type }],
      status: bot.config.presence.status,
    });
  },
};
