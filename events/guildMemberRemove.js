module.exports = {
  name: 'guildMemberRemove',
  once: false,
  execute: async (member, bot) => {
    const defaultChannel = member.guild.channels.cache.find((c) => c.name === bot.config.welcomeChannel);
    defaultChannel.send(`${member} ha dejado el servidor`).then((c) => c.react('🇫'));
    bot.logger.log(`${member.user.tag} ha abandonado el servidor`);
  },
};
