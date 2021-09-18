const { Op } = require('sequelize');
const { PokemonRom } = require('../../libs/database/index');

async function deactivateRom() {
  return PokemonRom.update(
    { currentlyRunning: false, currentlyCompeting: false },
    { where: { [Op.or]: { currentlyCompeting: true, currentlyRunning: true } } },
  );
}

module.exports = {
  name: 'endtournament',
  description: 'Termina el torneo activo.',
  category: 'pokemon',
  cooldown: 5,
  deactivate: async () => {
    await deactivateRom();
  },
  run: async (interaction) => {
    await deactivateRom(interaction);
    return interaction.reply('El torneo ha acabado.');
  },
};
