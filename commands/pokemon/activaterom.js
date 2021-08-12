const deactivaterom = require('./deactivaterom');
const { PokemonRom } = require('../../libs/database/index');

module.exports = {
  name: 'activaterom',
  description: 'Indica que una ROM está siendo usada para un torneo',
  category: 'pokemon',
  args: true,
  usage: '<ID de la ROM>',
  cooldown: 5,
  run: async (message, args) => {
    const rom = await PokemonRom.findOne({ where: { id: args[0] } });
    if (rom !== null) {
      await deactivaterom.run(message);
      await PokemonRom.update({ currentlyRunning: true }, { where: { id: rom.id } });
      message.reply('Esta ROM es la activa actualmente.');
    }
    else {
      message.reply('El ID no ha sido encontrado');
    }
  },
};
