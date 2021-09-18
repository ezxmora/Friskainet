const { currentActiveROM } = require('../../utils/pokemon/commonQueries');

module.exports = {
  name: 'usercomplete',
  description: 'Marca que un usuario ha completado la fase de jugar del torneo activo.',
  options: [{
    name: 'id',
    type: 'STRING',
    description: 'Id del usuario a marcar como run completada',
    required: true,
  }, {
    name: 'team',
    type: 'STRING',
    description: 'URL con el equipo a usar',
    required: false,
  }],
  category: 'pokemon',
  cooldown: 5,
  run: async (interaction) => {
    const { PokemonRomUser } = interaction.client.database;
    const rom = await currentActiveROM();
    if (rom !== null) {
      const userId = interaction.options.getString('id');
      const userInfo = await PokemonRomUser.findOne({ where: { userId, pokemonRomId: rom.id } });
      if (userInfo === null) {
        return interaction.reply('El usuario indicado no está participando en el torneo.');
      }
      const team = interaction.options.getString('team');
      await PokemonRomUser.update({ playing: 1, team },
        { where: { userId, pokemonRomId: rom.id } });
      return interaction.reply('El estado del usuario se ha actualizado correctamente.');
    }
    return interaction.reply('No hay un torneo activo.');
  },
};
