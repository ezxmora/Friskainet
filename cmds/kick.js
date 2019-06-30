exports.run = async(bot, message, [mention, ...reason]) => {
    const modRole = message.guild.roles.find(role => role.name === bot.config.roleAdmin);
    if (!modRole)
        return bot.LogIt.warn("El rol no existe en el servidor");

    if (!message.member.roles.has(modRole.id))
        return message.reply("No puedes usar este comando");

    if (message.mentions.members.size === 0)
        return message.reply("Por favor menciona a un usuario para kickear");

    if (!message.guild.me.hasPermission("KICK_MEMBERS"))
        return message.reply("");

    const kickMember = message.mentions.members.first();

    await kickMember.kick(reason.join(" ")).then(member => {
        bot.LogIt.log(`${member.user.username} ha sido kickeado`);
        message.reply(`${member.user.username} ha sido kickeado.`);
    });
};