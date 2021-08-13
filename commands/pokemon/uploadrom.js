const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const { PokemonRom } = require('../../libs/database/index');

module.exports = {
  name: 'uploadrom',
  description: 'Sube una rom y la configuración del randomizer',
  category: 'pokemon',
  args: false,
  cooldown: 5,
  run: async (interaction) => {
    const { logger, config } = interaction.client;
    try {
      const filter = (m) => m.attachments.size > 0;
      interaction.reply('Sube la ROM');
      let collected = await interaction.channel.awaitMessages(filter, {
        max: 1, time: 60000, errors: ['time'],
      });
      const romAttach = collected.first().attachments.first();
      collected.first().reply('Sube la configuración del randomizer');
      collected = await interaction.channel.awaitMessages(filter, {
        max: 1, time: 60000, errors: ['time'],
      });
      const configAttach = collected.first().attachments.first();
      const files = await Promise.all([fetch(romAttach.url), fetch(configAttach.url)]);
      const romPath = path.resolve(config.randomizerRoute, romAttach.name);
      const destRom = fs.createWriteStream(romPath);
      files[0].body.pipe(destRom);
      const configPath = path.resolve(config.randomizerRoute, configAttach.name);
      const destConfig = fs.createWriteStream(configPath);
      files[1].body.pipe(destConfig);
      PokemonRom.create({
        currentROMPath: romPath,
        currentSettingsPath: configPath,
      });
      return collected.first().reply('La ROM se ha subido correctamente.');
    }
    catch (error) {
      logger.error(`Ha habido un error al subir la rom: ${error}`);
      return interaction.reply(`Ha habido un error al subir la rom: ${error}`);
    }
  },
};
