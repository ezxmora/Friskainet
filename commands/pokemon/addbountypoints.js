const config = require('../../resources/config');

module.exports = {
  name: 'addbountypoints',
  description: 'Añade puntos de bounty a un jugador.',
  category: 'pokemon',
  cooldown: 5,
  roles: [config.pokemonRole],
  options: [{
    name: 'id',
    type: 'STRING',
    description: 'Id del jugador',
    required: true,
  }, {
    name: 'points',
    type: 'INTEGER',
    description: 'Puntos a añadir',
    required: true,
  }],
  run: async (interaction) => {
    const { PokemonRomUser } = interaction.client.database;
    const { util } = interaction.client;
    const rom = await util.currentActiveROM();
    if (rom === null) {
      return interaction.reply('No hay torneo activo');
    }
    const player = await PokemonRomUser.findOne({ where: { pokemonRomId: rom.id, userId: interaction.options.getString('id') } });
    if (player === null) {
      return interaction.reply('No se ha encontrado el jugador indicado');
    }
    await PokemonRomUser.update({ bountyPoints: player.bountyPoints + interaction.options.getInteger('points') },
      { where: { pokemonRomId: rom.id, userId: player.userId } });
    return interaction.reply('Puntos añadidos correctamente.');
  },
};