module.exports = {
  name: 'message',
  once: false,
  execute: async (message, bot) => {
    if (message.author.bot || message.author.system) return;

    // Doesn't listen to DMs
    if (message.channel.type === 'dm') return;

    // Checks if the user is in the blacklist
    if (message.member.info.blacklisted) return;

    // Reacts to someone trying to @everyone
    if (message.content.includes('@everyone')) {
      const reactionEmoji = message.guild.emojis.cache.find((emoji) => emoji.name === 'ping');
      message.react(reactionEmoji);
    }

    // It gives away some tokens [1-100].
    message.member.giveTokens(Math.floor(Math.random() * 10) + 1);

    // Checks that he message has the prefix and it's a valid command.
    if (!message.content.startsWith(bot.config.prefix)) return;

    const args = message.content.slice(bot.config.prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    // The command doesn't exist
    if (!bot.commands.has(cmd)) return;

    const command = bot.commands.get(cmd);

    // The command needs permissions
    if (command.permissions) {
      const authorPerms = message.channel.permissionsFor(message.author);

      if (!authorPerms || !authorPerms.has(command.permissions)) {
        return message.reply('No tienes permisos para ejecutar este comando');
      }
    }

    // There is no cooldown
    const cooldowns = bot.commandCooldowns;

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Map());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    // Exists the cooldown
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`Por favor expera ${timeLeft.toFixed(1)} segundos(s) antes de usar el comando \`${command.name}\`.`);
      }
    }

    // Adds the cooldown
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // Missing arguments
    if (command.args && !args.length) {
      let reply = `No has puesto ningún argumento, ${message.author}`;

      if (command.usage) {
        reply += `\nEl uso correcto sería: \`${bot.config.prefix}${command.name} ${command.usage}\``;
      }
      return message.channel.send(reply);
    }

    try {
      bot.logger.cmd(`${message.author.tag} ha ejecutado ${command.name}`);
      command.run(message, args);
    }
    catch (error) {
      bot.logger.error(`Ha habido un error\n ${error}`);
    }
  },
};
