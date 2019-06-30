exports.run = async(bot, message, args) => {
    const colorInput = args[0].toUpperCase();
    const colors = message.guild.roles.filter(role => role.name.startsWith("#"));

    if (!colorInput.match('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')) return message.channel.send("Eso no es un color en hexadecimal");

    let role = message.guild.roles.find(r => r.name === colorInput);

    if (!role) {
        try {
            await message.guild.createRole({
                name: colorInput,
                color: colorInput,
                permissions: []
            });

            await message.member.removeRoles(colors);
            await message.member.addRole(role);
            message.channel.send(`Ahora tienes el color ${role}`);
        } catch (e) {
            bot.LogIt.error(`Ha fallado la operación ${e.message}`);
        }
    } else {
        try {
            await message.member.removeRoles(colors);
            await message.member.addRole(role);
            message.channel.send(`Ahora tienes el color ${role}`);
        } catch (e) {
            bot.LogIt.error(`Ha fallado la operación ${e.message}`);
        }
    }
}