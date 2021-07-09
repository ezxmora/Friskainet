module.exports = {
  name: 'shuffle',
  description: 'Baraja y divide en grupos una serie de elementos',
  category: 'utility',
  args: true,
  usage: '<N. de grupos> <Items separados por comas>',
  cooldown: 30,
  run: async (message, args) => {
    const { util: { chunk, shuffle, randomColor } } = message.client;
    const numberGroups = !Number.isNaN(args[0]) ? Number.parseInt(args[0], 10) : message.reply('El primer parámetro tiene que ser un número');
    const itemsToShuffle = await args.slice(1).join(' ').split(',').map((element) => element.trim());

    if (numberGroups > itemsToShuffle.length) return message.reply('El número de grupos no puede ser mayor que el de items');

    const chunkedAndShuffled = await chunk(shuffle(itemsToShuffle), numberGroups);

    const formattedGroups = {
      title: 'Shuffle',
      color: randomColor(),
      thumbnail: {
        url: message.client.user.avatarURL({ dynamic: true, format: 'png' }),
      },
      fields: [],
    };

    for (let i = 0; i < chunkedAndShuffled.length; i++) {
      const aux = { name: '', value: '' };
      aux.name = `**Grupo ${i + 1}**`;
      for (let j = 0; j < chunkedAndShuffled[i].length; j++) {
        if (chunkedAndShuffled[i].length !== j + 1) {
          aux.value += `${chunkedAndShuffled[i][j]} - `;
        }
        else {
          aux.value += `${chunkedAndShuffled[i][j]}\n`;
        }
      }
      formattedGroups.fields.push(aux);
    }

    return message.reply({ embed: formattedGroups });
  },
};
