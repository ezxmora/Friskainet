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

    // Reacts to someone trying to @everyone
    if (message.content.includes('@everyone')) {
      const reactionEmoji = message.guild.emojis.cache.find((emoji) => emoji.name === 'ping');
      message.react(reactionEmoji);
    }

    const { config: { prefix, debug }, commands, logger } = bot;
    if (!debug) {
      // It gives away some tokens [1-10].
      bot.giveTokens(message.author.id, bot.util.getRandomInt(1, 10));

      // It gives away some experience [100-200]
      const levelUp = await bot.giveExperience(message.author.id, bot.util.getRandomInt(100, 200));

      if (levelUp.level > userInfo.level) {
        message.channel.send({ content: `🎉 ${message.author} ha subido al nivel ${levelUp.level} 🎉` });
      }
    }
    else {
      // This is only for testing and developing commands, don't use it in production
      if (!message.content.startsWith(prefix)) return;

      const args = message.content.toLowerCase().substring(prefix.length).split(' ');
      const cmd = args[0];
      if (!commands.has(cmd)) return;

      const command = commands.get(cmd);
      try {
        command.run(message, args);
      }
      catch (error) {
        logger.error(`Ha habido un error\n ${error}`);
      }
    }
  },
};
