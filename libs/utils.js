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

  progressBarGenerator: (percentage, size) => {
    let progressBar = '';
    for (let i = 0; i < size; i++) {
      if (percentage < (i + 1) * 5) {
        progressBar += '▱';
      }
      else {
        progressBar += '▰';
      }
    }

    return progressBar;
  },

  isToday(inputDate) {
    const today = new Date();

    return inputDate.getDate() === today.getDate()
      && inputDate.getMonth() === today.getMonth();
  },

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
