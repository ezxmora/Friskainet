const { PokemonRom } = require('../../libs/database');

module.exports = {
  currentActiveROM: async () => PokemonRom.findOne({ where: { currentlyRunning: true } }),
};
