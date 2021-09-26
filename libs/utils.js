// const { MessageAttachment } = require('discord.js');
// const { unlinkSync } = require('fs');
const { Op } = require('sequelize');
const { PokemonRom } = require('./database');

module.exports = {
  replaceAll: (string, mapObject) => {
    const re = new RegExp(Object.keys(mapObject).join('|'), 'gi');

    return string.replace(re, (matched) => mapObject[matched.toLowerCase()]);
  },

  randomColor: () => (1 << 24) * Math.random() | 0,

  neededXP: (level, currentXP) => (500 * (level ** 2) - (500 * level)) - currentXP,
  // Fisher–Yates Shuffle
  shuffle: (array) => {
    let arrayLength = array.length;

    while (arrayLength) {
      const remaining = Math.floor(Math.random() * arrayLength--);
      const currentElement = array[arrayLength];
      array[arrayLength] = array[remaining];
      array[remaining] = currentElement;
    }

    return array;
  },
  // Divides an array in subgroups of arrays
  chunk: (array, size) => {
    const chunks = [];

    while (array.length) {
      chunks.push(array.splice(0, size));
    }

    return chunks;
  },

  // downloadVideo: (url, message) => {
  //   const filePath = `./resources/tmp/${url.split('/')[url.split('/').length - 1]}.mp4`;
  //   ytdl(url, { noWarnings: true, output: filePath })
  //     .then(async () => {
  //       const file = new MessageAttachment(filePath);
  //       await message.reply({ files: [file] });
  //       unlinkSync(filePath);
  //     })
  //     .catch((err) => {
  //       if (!err.message.includes('There\'s no video')) {
  //         if (err.message.includes('403')) {
  //           return message.channel.send({ content: 'Parece que el vídeo ha sido borrado :(' });
  //         }

  //         if (err.message.toLowerCase().includes('unknown message')) {
  //           unlinkSync(filePath);
  //           return message.channel.send({ content: 'Parece que has borrado el mensaje con el enlance...' });
  //         }

  //         return message.reply({ content: `No sé que ha pasado :( \`\`\`${err}\`\`\`` });
  //       }
  //     });
  // },

  getRandomInt: (min, max) => Math.floor(Math.random()
    * (Math.floor(max) - Math.ceil(min) + 1))
    + Math.ceil(min),

  playingState: Object.freeze({
    0: 'Jugando',
    1: 'Completado',
    2: 'Retirado',
  }),

  tournamentPhase: Object.freeze({
    0: 'No comenzado',
    1: 'Fase de juego',
    2: 'Fase de competición',
    3: 'Finalizado',
  }),


  isAColor: (color) => /^#[0-9A-F]{6}$/i.test(color),

  currentActiveROM: async () => PokemonRom.findOne({
    where:
    {
      tournamentPhase: {
        [Op.gt]: 0,
        [Op.lt]: 3,
      },
    },
  }),
};
