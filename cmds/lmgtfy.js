exports.run = async(bot, message, args) => {
    const username = message.mentions.members.first();
    let query = args.slice(1).join('+');
    message.delete();
    if (!username)
        return message.channel.send("Tienes que especificar un usuario.");

    if (!query || query.includes(username))
        return message.channel.send("Tienes que especificar algo válido para buscar.");

    await message.channel.send(`${username} échale un ojo a:\nhttps://lmgtfy.com/?q=${query}`);
}