const deactivaterom = require('./endtournament');

module.exports = {
  name: 'startrunning',
  description: 'Comienza un torneo (fase de jugar). Un torneo tiene la fase de jugar el juego y la fase de competir',
  options: [{
    name: 'id',
    type: 'STRING',
    description: 'Id de la ROM a jugar',
    required: true,
  }],
  category: 'pokemon',
  cooldown: 5,
  run: async (interaction) => {
    const { PokemonRom } = interaction.client.database;

    const rom = await PokemonRom.findOne({ where: { id: interaction.options.getString('id') } });
    if (rom !== null) {
      await deactivaterom.deactivate();
      await PokemonRom.update({ currentlyRunning: true }, { where: { id: rom.id } });
      return interaction.reply(`El torneo con esta ROM ha empezado!: ${rom.id}`);
    }

    return interaction.reply('El ID no ha sido encontrado');
  },
};
