const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute: async (bot) => {
    const allUsers = await bot.getAllUsers();
    bot.logger.log(`${bot.user.tag} funcionando y sirviendo a ${allUsers.size} usuarios`);
    bot.user.setPresence({
      activities: [{ name: `${allUsers.size} usuarios 💤`, type: ActivityType.Watching }],
      status: 'online',
    });
  },
};
