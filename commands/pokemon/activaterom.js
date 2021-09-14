const deactivaterom = require('./deactivaterom');

module.exports = {
  name: 'activaterom',
  description: 'Indica que una ROM está siendo usada para un torneo',
  options: [{
    name: 'id',
    type: 'STRING',
    description: 'Id de la ROM',
    required: true,
  }],
  category: 'pokemon',
  cooldown: 5,
  run: async (interaction) => {
    const { PokemonRom } = interaction.client.database;

    const rom = await PokemonRom.findOne({ where: { id: interaction.options.getString('id') } });
    if (rom !== null) {
      await deactivaterom.deactivate();
      await PokemonRom.update({ currentlyRunning: true }, { where: { id: rom.id } });
      return interaction.reply(`Esta ROM es la activa actualmente: ${rom.id}`);
    }

    return interaction.reply('El ID no ha sido encontrado');
  },
};
