const { PokemonRom } = require('../../libs/database/index');

async function deactivateRom() {
  return PokemonRom.update(
    { currentlyRunning: false }, { where: { currentlyRunning: true } },
  );
}

module.exports = {
  name: 'deactivaterom',
  description: 'Indica que la ROM activa ya no está siendo usada para un torneo',
  category: 'pokemon',
  cooldown: 5,
  deactivate: async () => {
    await deactivateRom();
  },
  run: async (interaction) => {
    await deactivateRom(interaction);
    return interaction.reply('La ROM previamente activa ya no lo está.');
  },
};
