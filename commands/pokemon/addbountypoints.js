const config = require('@config');

module.exports = {
  name: 'addbountypoints',
  description: 'Añade puntos de bounty a un jugador.',
  category: 'pokemon',
  cooldown: 5,
  roles: [config.pokemonRole],
  run: async (interaction) => {
    const { PokemonRomUser } = interaction.client.database;
    const { util } = interaction.client;
    const rom = await util.currentActiveROM();
    if (rom === null) {
      return interaction.reply({ content: 'No hay torneo activo' });
    }
    const player = await PokemonRomUser.findOne({ where: { pokemonromId: rom.id, userId: interaction.options.getString('id') } });
    if (player === null) {
      return interaction.reply({ content: 'No se ha encontrado el jugador indicado' });
    }
    await PokemonRomUser.update({ bountyPoints: player.bountyPoints + interaction.options.getInteger('points') },
      { where: { pokemonromId: rom.id, userId: player.userId } });
    return interaction.reply({ content: 'Puntos añadidos correctamente.' });
  },
};
