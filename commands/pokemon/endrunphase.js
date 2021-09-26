const { Util } = require('discord.js');
const config = require('../../resources/config');
const challongeapi = require('../../libs/challongeapi');

module.exports = {
  name: 'endrunphase',
  description: 'Comienza la fase de competir o segunda fase del torneo actual.',
  category: 'pokemon',
  cooldown: 5,
  roles: [config.pokemonRole],
  run: async (interaction) => {
    const { PokemonRom, PokemonRomUser } = interaction.client.database;
    const { logger, util } = interaction.client;
    // Run async because we have lots of queries
    // and that can make de interaction time out
    util.currentActiveROM().then(async (rom) => {
      if (rom !== null) {
        const channel = interaction.guild.channels.cache.get(rom.channelId);
        let promiseResults = await Promise.all([
          PokemonRomUser.findAll({ where: { playing: 1 } }),
          challongeapi.create(rom.tournamentName),
        ]);
        const challongeTournament = promiseResults[1];
        const players = promiseResults[0]
          .map((pru) => ({
            name: interaction.guild.members.cache.get(pru.userId).displayName,
            misc: interaction.guild.members.cache.get(pru.userId).id,
          }));
        const participants = await challongeapi
          .addParticipants(challongeTournament.tournament.id, players);
        await Promise.all(
          participants.map((p) => PokemonRomUser.update({ challongeId: p.participant.id },
            { where: { userId: p.participant.misc } })),
        );
        let teams = 'Los equipos del torneo son:\n';
        for (let i = 0; i < players.length; i++) {
          const { team } = promiseResults[0][i];
          if (team) {
            const playerName = players[i].name;
            teams = teams.concat(`${playerName}: ${team}\n`);
          }
        }
        const message = `¡La competición ha empezado! Todos los jugadores que no hayan completado la run han sido descalificados. Se va a proceder a realizar el emparejamiento.\n\n${teams}\nPodéis ver contra quien os enfrentáis aquí: ${challongeTournament.tournament.full_challonge_url}`;
        promiseResults = await Promise.all([
          PokemonRom.update(
            {
              tournamentPhase: 1,
              challongeTournamentId: challongeTournament.tournament.id,
            },
            { where: { id: rom.id } },
          ),
          PokemonRomUser.update(
            { playing: 2 },
            { where: { pokemonRomId: rom.id, playing: 0 } },
          ),
          challongeapi.start(challongeTournament.tournament.id),
        ]);
        const maxSize = 2000;
        if (message.length > maxSize) {
          const chunks = Util.splitMessage(message);
          for (let i = 0; i < chunks.length; i++) {
            // eslint-disable-next-line no-await-in-loop
            await channel.send({
              content: chunks[i],
            });
          }
        }
        else {
          await channel.send({
            content: message,
          });
        }
      }
    })
      .then(() => logger.log('La fase de competición ha empezado.'))
      .catch((error) => logger.error(error));
    return interaction.reply('La fase de competición está comenzando.');
  },
};
