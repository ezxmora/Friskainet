const config = require('@config');

module.exports = {
  name: 'addteam',
  description: 'Añade un equipo a un usuario que ha completado la fase de juego.',
  options: [{
    name: 'id',
    type: 'STRING',
    description: 'Id del usuario a marcar como run completada',
    required: true,
  }, {
    name: 'team',
    type: 'STRING',
    description: 'URL con el equipo a usar',
    required: true,
  }],
  category: 'pokemon',
  cooldown: 5,
  roles: [config.pokemonRole],
  run: async (interaction) => {
    const { PokemonRomUser } = interaction.client.database;
    const { util } = interaction.client;
    const rom = await util.currentActiveROM();
    if (rom !== null) {
      const userId = interaction.options.getString('id');
      const userInfo = await PokemonRomUser.findOne({ where: { userId, pokemonromId: rom.id } });
      if (userInfo === null) {
        return interaction.reply({ content: 'El usuario indicado no está participando en el torneo.' });
      }
      const team = interaction.options.getString('team');
      await PokemonRomUser.update({ team }, { where: { userId, pokemonromId: rom.id } });
      return interaction.reply({ content: 'El estado del usuario se ha actualizado correctamente.' });
    }
    return interaction.reply({ content: 'No hay un torneo activo.' });
  },
};
