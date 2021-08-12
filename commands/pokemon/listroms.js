const path = require('path');
const { PokemonRom } = require('../../libs/database/index');

module.exports = {
  name: 'listroms',
  description: 'Lista toda las ROMs subidas al servidor',
  category: 'pokemon',
  args: false,
  cooldown: 5,
  run: async (message) => {
    const roms = await PokemonRom.findAll();
    let reply = '';
    roms.forEach((rom) => {
      reply = reply.concat(
        `**ID:** ${rom.id}\n**Activo:** ${(rom.currentlyRunning ? 'Sí' : 'No')}\n**ROM:** ${path.basename(rom.currentROMPath)}\n**Config:** ${path.basename(rom.currentSettingsPath)}\n\n`,
      );
    });
    if (!reply) {
      message.channel.send('No existen ROMs en el sistema. Prueba a subir una.');
    }
    else {
      message.channel.send(reply);
    }
  },
};
