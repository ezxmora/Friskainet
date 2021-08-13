const { PokemonRom } = require('../../libs/database/index');

module.exports = {
  name: 'deactivaterom',
  description: 'Indica que la ROM activa ya no está siendo usada para un torneo',
  category: 'pokemon',
  cooldown: 5,
  run: async (interaction) => {
    await PokemonRom.update(
      { currentlyRunning: false }, { where: { currentlyRunning: true } },
    );
    interaction.reply('La ROM activa ya no lo está.');
  },
};
