module.exports = {
  name: 'messageCreate',
  once: false,
  execute: async (message, bot) => {
    if (message.author.bot || message.author.system) return;

    // Doesn't listen to DMs
    if (message.channel.type === 'dm') return;

    // Checks if the user is in the blacklist
    const userInfo = await bot.userInfo(message.author.id);
    if (userInfo.blacklisted) return;

    if (message.content.includes('@here')) return;

    // Reacts to someone trying to @everyone
    if (message.content.includes('@everyone')) {
      const reactionEmoji = message.guild.emojis.cache.find((emoji) => emoji.name === 'ping');
      message.react(reactionEmoji);
      return;
    }

    const { database: { User, Stat } } = bot;

    const messageToLowerCase = message.content.toLowerCase();

    // It gives away some tokens [1-10].
    bot.giveTokens(message.author.id, bot.util.getRandomInt(1, 10));

    // It gives away some experience [100-200]
    const levelUp = await bot.giveExperience(message.author.id, bot.util.getRandomInt(100, 200));

    if (levelUp.level > userInfo.level) {
      message.channel.send({ content: `🎉 ${message.author} ha subido al nivel ${levelUp.level} 🎉` });
    }

    const splittedMesssage = messageToLowerCase.split(' ');
    splittedMesssage.forEach(async (word) => {
      // Is a user mention
      if (word.startsWith('<@')) {
        const userId = word.replace(/<@|>/g, '');
        if (userId === message.author.id) {
          User.increment('mentions', { by: 1, where: { userId } });
          User.increment('messages', { by: 1, where: { userId } });
          Stat.increment('mentions', { by: 1, where: { server: message.guildId } });
        }
      }
      // Is a link, it counts embedded images too
      if (/^http/i.test(word)) {
        Stat.increment('links', { by: 1, where: { server: message.guildId } });
      }
    });

    Stat.increment('messages', { by: 1, where: { server: message.guildId } });
  },
};
