module.exports = {
  name: 'playerstatus',
  description: 'Muestra la lista de jugadores en el torneo actual',
  category: 'pokemon',
  cooldown: 5,
  run: async (interaction) => {
    const { PokemonRomUser } = interaction.client.database;
    const { util } = interaction.client;
    const rom = await util.currentActiveROM();
    if (rom === null) {
      return interaction.reply('No hay un torneo activo.');
    }
    const users = await PokemonRomUser.findAll({ where: { pokemonRomId: rom.id }, order: [['playing', 'ASC']] });
    let reply = '';
    await users.forEach(async (user) => {
      const userProfile = await interaction.client.users.fetch(user.userId);
      const status = util.playingStatus[user.playing];
      reply = reply.concat(
        `**Usuario:** ${userProfile.username}\n**Estado:** ${status}\n`,
      );
      const hasTeam = user.team !== null;
      if (hasTeam) {
        reply = reply.concat(`**Equipo:** ${user.team}`);
      }
      reply = reply.concat('\n');
    });
    if (!reply) {
      return interaction.reply('No hay jugadores apuntados a este torneo.');
    }

    return interaction.reply(reply);
  },
};
