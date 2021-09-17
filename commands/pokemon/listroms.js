module.exports = {
  name: 'listroms',
  description: 'Lista toda las ROMs subidas al servidor',
  category: 'pokemon',
  cooldown: 5,
  run: async (interaction) => {
    const { PokemonRom } = interaction.client.database;
    const roms = await PokemonRom.findAll();
    let reply = '';
    roms.forEach((rom) => {
      reply = reply.concat(
        `**ID:** ${rom.id}\n**Activo:** ${(rom.currentlyRunning ? 'Sí' : 'No')}\n**ROM:** ${rom.name}\n**Config:** ${rom.currentSettingsPath}\n\n`,
      );
    });
    if (!reply) {
      return interaction.reply('No existen ROMs en el sistema. Prueba a subir una.');
    }

    return interaction.reply(reply);
  },
};
