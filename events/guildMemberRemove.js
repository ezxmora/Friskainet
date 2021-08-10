module.exports = {
  name: 'guildMemberRemove',
  once: false,
  execute: async (member, bot) => {
    const { config: { channels } } = bot;
    if (!member.user.bot) {
      const channel = await member.guild.channels.cache.find((c) => c.name === channels.welcome);
      channel.send(`${member.user.tag} ha dejado el servidor`).then((c) => c.react('🇫'));
      bot.logger.log(`${member.user.tag} ha abandonado el servidor`);
    }
  },
};
