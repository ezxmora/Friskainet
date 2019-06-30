module.exports = async(bot, message) => {
    if (message.author.bot) return;

    // No quiere escuchar los DM
    if (message.channel.type === "dm") return;

    // Comprobamos si está en la blaclist
    if (bot.db.isBlacklisted(bot, message.author.id)) return;

    // Le damos tokens a los usuarios por mandar un mensaje
    //await bot.db.modTokens(bot, message.author.id, Math.ceil(Math.random() * 10));

    // Comprobamos que tenga el prefix y vemos si es un comando o no
    if (message.content.indexOf(bot.config.prefix) !== 0) return;

    const args = message.content.slice(bot.config.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    const command = bot.commands.get(cmd);

    if (!command) return;
    await command.run(bot, message, args);
}