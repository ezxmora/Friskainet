const { Op } = require('sequelize');
const { PokemonRom } = require('../../libs/database/index');
const config = require('../../resources/config');

async function deactivateRom() {
  return PokemonRom.update(
    { currentlyRunning: false, currentlyCompeting: false },
    { where: { [Op.or]: { currentlyCompeting: true, currentlyRunning: true } } },
  );
}

module.exports = {
  name: 'endtournament',
  description: 'Termina el torneo activo.',
  options: [{
    name: 'id',
    type: 'STRING',
    description: 'Id del usuario a marcar como ganador.',
    required: true,
  }],
  category: 'pokemon',
  cooldown: 5,
  roles: [config.pokemonRole],
  deactivate: async () => {
    await deactivateRom();
  },
  run: async (interaction) => {
    const { PokemonRomUser } = interaction.client.database;
    const { util } = interaction.client;
    const rom = await util.currentActiveROM();
    if (rom !== null) {
      const userId = interaction.options.getString('id');
      const userInfo = await PokemonRomUser.findOne({ where: { userId, pokemonRomId: rom.id } });
      if (userInfo === null) {
        return interaction.reply('El usuario indicado no está participando en el torneo.');
      }
      await PokemonRomUser.update({ winner: true }, { where: { userId, pokemonRomId: rom.id } });
      await deactivateRom(interaction);
      return interaction.reply('El torneo ha acabado.');
    }
    return interaction.reply('No hay un torneo activo.');
  },
};
