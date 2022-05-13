module.exports = {
  name: 'guildMemberAdd',
  once: false,
  execute: async (member, bot) => {
    const { config: { channels } } = bot;
    if (!member.user.bot) {
      const channel = await member.guild.channels.cache.find((c) => c.name === channels.logs);

      channel.send({
        embeds: [{
          color: '#00AAFF',
          description: `[${member.id}] - **${member.user.tag}** se unió al servidor`,
        }],
      });

      // Checks if the user exists and if it doesn't adds it
      const userExists = await bot.database.User.findOne({ where: { discordID: member.id } });

      if (!userExists) {
        bot.database.User.create({ userId: member.id })
          .then((user) => {
            bot.logger.db(`${user.discordID} ha sido añadido a la base de datos`);
          })
          .catch((err) => bot.logger.error(err));
      }
    }
  },
};
