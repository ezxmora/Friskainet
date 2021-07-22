const { PokemonRom } = require('../../libs/database/index');

module.exports = {
  name: 'deactivaterom',
  description: 'Indica que la ROM activa ya no está siendo usada para un torneo',
  category: 'pokemon',
  args: false,
  cooldown: 5,
  run: async (message) => {
    await PokemonRom.update({ currentlyRunning: false }, { where: { currentlyRunning: true } });
    message.reply('La ROM ya no está activa.');
  },
};
