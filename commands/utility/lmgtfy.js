module.exports = {
  name: 'lmgtfy',
  description: 'Crea una búsqueda en Let Me Google That',
  category: 'utility',
  run: async (interaction) => {
    const query = interaction.options.getString('busqueda').split(' ').join('+');
    const url = `https://lmgt.com/?q=${query}`;
    return interaction.reply({ content: `${url}` });
  },
};
