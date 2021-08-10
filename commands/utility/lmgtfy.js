module.exports = {
  name: 'lmgtfy',
  description: 'Crea una búsqueda en Let Me Google That',
  options: [{
    name: 'busqueda',
    type: 'STRING',
    description: 'Término a buscar',
    required: true,
  }],
  category: 'utility',
  usage: '<Término a buscar en Google>',
  run: async (interaction) => {
    const query = interaction.options.getString('busqueda').split(' ').join('+');
    const url = `https://lmgt.com/?q=${query}`;
    return interaction.reply({ content: `${url}` });
  },
};
