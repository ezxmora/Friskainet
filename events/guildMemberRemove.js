module.exports = (bot, member) => {
    const defaultChannel = member.guild.channels.find(channel => channel.name === 'entrada');
    defaultChannel.send(`${member} ha dejado el servidor, F`);
    bot.LogIt.log(`${member.user.tag} ha abandonado el servidor`);
}