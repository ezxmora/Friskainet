module.exports = (bot, member) => {
    const defaultChannel = member.guild.channels.find(channel => channel.name === 'entrada');

    const greetings = bot.config.greetings[Math.floor(Math.random() * bot.config.greetings.length)];
    defaultChannel.send(greetings.replace("{{user}}", `${member}`));
    bot.LogIt.log(`${member.user.tag} se ha unido al servidor`);
    bot.db.addUser(bot, member.user.id, member.user.tag);
}