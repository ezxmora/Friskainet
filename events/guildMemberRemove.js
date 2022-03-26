module.exports = {
  name: 'guildMemberRemove',
  once: false,
  execute: async (member, bot) => {
    const { config: { channels } } = bot;
    if (!member.user.bot) {
      const channel = await member.guild.channels.cache.find((c) => c.name === channels.logs);
      channel.send({
        embeds: [{
          color: '#FFFF00',
          description: `[${member.id}] - **${member.user.tag}** se abandonó al servidor`,
        }],
      });

      bot.logger.log(`${member.user.tag} ha abandonado el servidor`);
    }
  },
};
