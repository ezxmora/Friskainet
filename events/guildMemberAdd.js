module.exports = {
  name: 'guildMemberAdd',
  once: false,
  execute: async (member, bot) => {
    const { config: { channels, greetings } } = bot;
    if (!member.user.bot) {
      const channel = await member.guild.channels.cache.find((c) => c.name === channels.welcome);

      const greet = greetings[Math.floor(Math.random() * greetings.length)];

      channel.send({ content: greet.replace('{{user}}', member) });

      // Checks if the user exists and if it doesn't adds it
      const userExists = await bot.database.User.findOne({ where: { discordID: member.id } });

      if (!userExists) {
        bot.database.User.create({
          discordID: member.id,
          birthday: null,
        })
          .then((user) => {
            bot.logger.db(`${user.discordID} ha sido añadido a la base de datos`);
          })
          .catch((err) => bot.logger.error(err));
      }
    }
  },
};
