const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const { PokemonRom } = require('../../libs/database/index');

function filter(message) {
  const isAttachment = message.attachments.size > 0;
  if (isAttachment) return true;
  let url;
  try {
    url = new URL(message.content);
  }
  catch (_) {
    return false;
  }
  return (url.protocol === 'http:' || url.protocol === 'https:');
}

let lastMessage;

/**
 * Downloads attachment or URL from message and writes it to a file
 * Note: Maybe some checks are unnecessary given the filter in the awaitMessages
 * @param {*} message Discord Message
 * @param {*} interaction Discord interaction
 * @param {*} route Path of directory to save the file
 * @returns path to file in file system
 */
async function downloadFile(message, interaction, route) {
  const attach = message.attachments.first();
  let file;
  let name;
  if (attach) {
    file = await fetch(attach.url);
    name = attach.name;
  }
  else {
    // Throws error if message content is not an URL
    const url = new URL(message.content);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      lastMessage = await message.reply('URL detectada, elige un nombre para el fichero (recuerda añadir la extensión de fichero correcta por ej.: rom.nds):');
      const collectedName = await interaction.channel.awaitMessages({
        max: 1, time: 60000, errors: ['time'],
      });
      name = collectedName.first().content;
      file = await fetch(url);
    }
    else {
      throw new Error('Invalid URL');
    }
  }
  const filePath = path.resolve(route, name);
  const destRom = fs.createWriteStream(filePath);
  file.body.pipe(destRom);
  return filePath;
}

module.exports = {
  name: 'uploadrom',
  description: 'Sube una rom y la configuración del randomizer',
  category: 'pokemon',
  args: false,
  cooldown: 5,
  run: async (interaction) => {
    const { logger, config } = interaction.client;
    try {
      lastMessage = await interaction.reply('Sube la ROM (pasa una URL o adjunta el archivo en un mensaje):');
      const collectedRom = await interaction.channel.awaitMessages({
        filter, max: 1, time: 60000, errors: ['time'],
      });
      const romPath = await downloadFile(collectedRom.first(), interaction, config.randomizerRoute);
      lastMessage = await collectedRom.first().reply('Sube la configuración del randomizer (pasa una URL o adjunta el archivo en un mensaje):');
      const collectedConfig = await interaction.channel.awaitMessages({
        filter, max: 1, time: 60000, errors: ['time'],
      });
      const settingsPath = await downloadFile(collectedConfig.first(),
        interaction, config.randomizerRoute);
      PokemonRom.create({
        currentROMPath: romPath,
        currentSettingsPath: settingsPath,
      });
      return collectedConfig.first().reply('La ROM se ha subido correctamente.');
    }
    catch (error) {
      logger.error(`Ha habido un error al subir la rom: ${error}`);
      return lastMessage.reply(`Ha habido un error al subir la rom: ${error}`);
    }
  },
};
