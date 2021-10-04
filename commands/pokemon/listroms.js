module.exports = {
  name: 'listroms',
  description: 'Lista toda las ROMs subidas al servidor',
  category: 'pokemon',
  cooldown: 5,
  run: async (interaction) => {
    const { PokemonRom } = interaction.client.database;
    const { util } = interaction.client;
    const roms = await PokemonRom.findAll();
    let reply = '';
    roms.forEach((rom) => {
      reply = reply.concat(
        `**ID:** ${rom.id}\n**Estado del torneo:** ${util.tournamentPhase[rom.tournamentPhase]}\n**ROM:** ${rom.name}\n**Config:** ${rom.currentSettingsPath}\n\n`,
      );
    });
    if (!reply) {
      return interaction.reply({ content: 'No existen ROMs en el sistema. Prueba a subir una.' });
    }

    return interaction.reply({ content: reply });
  },
};
