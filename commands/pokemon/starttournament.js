const { Util, Permissions } = require('discord.js');
const fetch = require('node-fetch');
const config = require('@config');
const deactivaterom = require('./endtournament');

module.exports = {
  name: 'starttournament',
  description: 'Comienza un torneo (fase de jugar o primera fase), creando un canal de texto con las normas.',
  options: [{
    name: 'id',
    type: 'STRING',
    description: 'Id de la ROM a jugar',
    required: true,
  }, {
    name: 'name',
    type: 'STRING',
    description: 'Nombre del torneo',
    required: true,
  }, {
    name: 'channel',
    type: 'STRING',
    description: 'Nombre del canal a crear',
    required: true,
  }, {
    name: 'category',
    type: 'STRING',
    description: 'ID de la categoría en la que añadir el canal nuevo',
    required: false,
  }],
  category: 'pokemon',
  cooldown: 5,
  roles: [config.pokemonRole],
  run: async (interaction) => {
    const categoryId = interaction.options.getString('category');
    let category;
    if (categoryId) {
      category = interaction.guild.channels.cache.find((c) => c.id === categoryId && c.type === 'GUILD_CATEGORY');
      if (!category) {
        return interaction.reply({ content: `No se ha encontrado la categoría: ${categoryId}` });
      }
    }
    const { PokemonRom } = interaction.client.database;
    const rom = await PokemonRom.findOne({ where: { id: interaction.options.getString('id') } });
    if (rom !== null) {
      await interaction.reply({ content: 'Sube las normas del torneo (formato texto o Markdown).' });
      const filter = (message) => message.attachments.size > 0;
      const collectedRules = await interaction.channel.awaitMessages({
        filter, max: 1, time: 60000, errors: ['time'],
      });
      const attach = collectedRules.first().attachments.first();
      const rulesFile = await fetch(attach.url);
      // Get text from rules file, deactivate current active rom if there is one
      // and change status of rom to play to currently running
      let parallelPromises = await Promise.all([
        rulesFile.text(),
        deactivaterom.deactivate(),
        interaction.guild.channels.create(interaction.options.getString('channel'), {
          type: 'GUILD_TEXT',
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              allow: [Permissions.FLAGS.VIEW_CHANNEL],
              deny: [Permissions.FLAGS.SEND_MESSAGES],
            }, {
              id: config.pokemonRole,
              allow: [
                Permissions.FLAGS.VIEW_CHANNEL,
                Permissions.FLAGS.SEND_MESSAGES,
              ],
            },
          ],
        }),
      ]);
      const newChannel = parallelPromises[2];
      const rulesText = parallelPromises[0];
      parallelPromises = [
        PokemonRom.update({
          tournamentPhase: 1,
          channelId: newChannel.id,
          tournamentName: interaction.options.getString('name'),
        }, { where: { id: rom.id } }),
      ];
      if (category) {
        parallelPromises.push(newChannel.setParent(category));
      }
      await Promise.all(parallelPromises);
      const maxSize = 2000;
      if (rulesText.length > maxSize) {
        const chunks = Util.splitMessage(rulesText);
        for (let i = 0; i < chunks.length; i++) {
          // eslint-disable-next-line no-await-in-loop
          await newChannel.send({
            content: chunks[i],
            files: i === chunks.length - 1 ? [rom.currentSettingsPath] : [],
          });
        }
      }
      else {
        await newChannel.send({
          content: rulesText,
          files: [rom.currentSettingsPath],
        });
      }
      return collectedRules.first().reply({ content: `¡El torneo con esta ROM ha empezado!: ${rom.id}` });
    }

    return interaction.reply({ content: 'El ID no ha sido encontrado' });
  },
};
