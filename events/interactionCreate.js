module.exports = {
  name: 'interactionCreate',
  once: false,
  execute: async (interaction, bot) => {
    const { logger, database: { Stat } } = interaction.client;
    if (!interaction.isCommand()) return;

    // Checks if the user is in the blacklist
    const userInfo = await bot.userInfo(interaction.member.id);
    if (userInfo.blacklisted) return;

    const cmd = interaction.commandName;

    if (!bot.commands.has(cmd)) return;

    const command = bot.commands.get(cmd);
    const cooldowns = bot.commandCooldowns;

    // Doesn't exist a cooldown
    if (!cooldowns.has(cmd)) {
      cooldowns.set(cmd, new Map());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(cmd);
    const cooldownAmount = (command.coldown || 3) * 1000;

    // Exists the cooldown
    if (timestamps.has(interaction.member.id)) {
      const expirationDate = timestamps.get(interaction.member.id) + cooldownAmount;

      if (now < expirationDate) {
        const timeLeft = (expirationDate - now) / 1000;
        return interaction.reply({ content: `Por favor espera, ${timeLeft.toFixed(1)} segundo(s) antes de usar el comando \`${cmd}\`` });
      }
    }

    // Adding the cooldown
    timestamps.set(interaction.member.id, now);
    setTimeout(() => timestamps.delete(interaction.member.id), cooldownAmount);

    // It gives away some tokens [1-10].
    bot.giveTokens(interaction.member.id, bot.util.getRandomInt(1, 10));

    // It gives away some experience [100-200]
    const levelUp = await bot.giveExperience(interaction.member.id, bot.util.getRandomInt(100, 200));
    if (levelUp.level > userInfo.level) {
      interaction.channel.send({ content: `🎉 ${interaction.user} ha subido al nivel ${levelUp.level} 🎉` });
    }

    try {
      Stat.increment('commands', { by: 1, where: { server: interaction.guildId } });
      logger.cmd(`${interaction.user.tag} ha ejecutado ${cmd}`);
      command.run(interaction);
    }
    catch (error) {
      logger.error(`Ha habido un error\n ${error}`);
      await interaction.reply({ content: 'Ha habido un error al ejecutar este comando', ephemeral: true });
    }
  },
};
