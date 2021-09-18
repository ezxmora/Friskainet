const { currentActiveROM } = require('../../utils/pokemon/commonQueries');

module.exports = {
  name: 'endrunphase',
  description: 'Comienza la fase de competir o segunda fase del torneo actual.',
  category: 'pokemon',
  cooldown: 5,
  run: async (interaction) => {
    const { PokemonRom, PokemonRomUser } = interaction.client.database;

    const rom = await currentActiveROM();
    if (rom !== null) {
      await PokemonRom.update(
        { currentlyCompeting: true, currentlyRunning: false },
        { where: { id: rom.id } },
      );
      await PokemonRomUser.update(
        { playing: 2 },
        { where: { pokemonRomId: rom.id, playing: 0 } },
      );
      return interaction.reply('¡La fase de competir ha empezado! Todos los jugadores que no hayan completado la run han sido descalificados.');
    }

    return interaction.reply('No se está jugando ningun torneo actualmente.');
  },
};
