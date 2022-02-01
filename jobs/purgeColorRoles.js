module.exports = {
  name: 'purgeColorRoles',
  expression: '0 0 4 * * *',
  run: async (bot) => {
    const guilds = await bot.guilds.fetch();
    guilds.map(async (guild) => {
      const guildInfo = await bot.guilds.fetch(guild.id);
      const guildRoles = await guildInfo.roles.fetch();
      const colorRoles = guildRoles.filter((role) => role.name.includes('color-'));

      colorRoles.forEach(async (role) => {
        const roleMembers = await role.members;

        if (roleMembers.size === 0) {
          await role.delete();
          bot.logger.warn(`El rol ${role.name} se ha borrado`);
        }
      });
    });
  },
};
