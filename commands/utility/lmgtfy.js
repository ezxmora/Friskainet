module.exports = {
  name: 'lmgtfy',
  description: 'Crea una búsqueda en Let Me Google That',
  category: 'utility',
  args: true,
  usage: '<Término a buscar en Google>',
  run: async (message, args) => {
    const query = args.join('+');
    const url = `https://lmgt.com/?q=${query}`;
    message.channel.send(url);
  },
};
