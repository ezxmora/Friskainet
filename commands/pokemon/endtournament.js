const { Op } = require('sequelize');
const { PokemonRom } = require('@libs/database/index');
const config = require('@config');
const challongeapi = require('@libs/apis/challongeapi');

async function deactivateRom() {
  return PokemonRom.update(
    { tournamentPhase: 3 },
    { where: { tournamentPhase: { [Op.lt]: 3 } } },
  );
}

module.exports = {
  name: 'endtournament',
  description: 'Termina el torneo activo.',
  options: [{
    name: 'winner',
    type: 'STRING',
    description: 'Id del usuario a marcar como ganador.',
    required: true,
  }, {
    name: 'category',
    type: 'STRING',
    description: 'ID de la categoría a la que mover el canal designado para el torneo',
    required: false,
  }],
  category: 'pokemon',
  cooldown: 5,
  roles: [config.pokemonRole],
  deactivate: async () => {
    await deactivateRom();
  },
  run: async (interaction) => {
    const { PokemonRomUser } = interaction.client.database;
    const { logger, util } = interaction.client;
    const rom = await util.currentActiveROM();
    if (rom !== null) {
      const pokeChannel = interaction.guild.channels.cache.find((c) => c.id === rom.channelId);
      let category;
      if (!pokeChannel) {
        logger.warn(`Channel has not been found: ${rom.channelId}`);
      }
      else {
        const categoryId = interaction.options.getString('category');
        if (categoryId) {
          category = interaction.guild.channels.cache.find((c) => c.id === categoryId && c.type === 'GUILD_CATEGORY');
          if (!category) {
            return interaction.reply({ content: `No se ha encontrado la categoría: ${categoryId}` });
          }
        }
      }
      const userId = interaction.options.getString('winner');
      const userInfo = await PokemonRomUser.findOne({ where: { userId, pokemonromId: rom.id } });
      if (userInfo === null) {
        return interaction.reply({ content: 'El usuario indicado no está participando en el torneo.' });
      }
      const user = interaction.guild.members.cache.get(userId);
      const parallelPromises = [
        PokemonRomUser.update({ winner: true }, { where: { userId, pokemonromId: rom.id } }),
        deactivateRom(interaction),
        challongeapi.stop(rom.challongeTournamentId),
      ];
      if (category) {
        parallelPromises.push(pokeChannel.setParent(category));
      }
      Promise.all(parallelPromises).then(() => logger.log('El torneo ha acabado.')).catch((errors) => logger.error(errors.toString()));
      return interaction.reply({ content: `¡El torneo ha acabado, gracias a todos por participar! Ganador: ${user.displayName}` });
    }
    return interaction.reply({ content: 'No hay un torneo activo.' });
  },
};
