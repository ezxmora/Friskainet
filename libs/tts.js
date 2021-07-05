const { createWriteStream, existsSync } = require('fs');
const fetch = require('node-fetch');
const logger = require('./logger');
const { voicerssToken } = require('../resources/config');

const synth = (text, path) => {
  if (existsSync(path)) {
    return path;
  }

  return new Promise((resolve, reject) => {
    const writable = createWriteStream(path);

    writable.on('error', (err) => {
      logger.error(`Ha habido un error al crear el archivo en ${path}`);
      reject(err);
    });

    writable.on('finish', () => {
      logger.log(`Se ha creado un archivo en ${path}`);
      resolve(path);
    });

    fetch(`http://api.voicerss.org/?key=${voicerssToken}&hl=es-es&c=mp3&f=ulaw_44khz_stereo&r=1&src=${text}`)
      .then((response) => {
        response.body.pipe(writable);
      })
      .catch((err) => {
        logger.error(`Ha habido un error al recuperar el archivo:\n${err}`);
      });
  });
};

module.exports = { synth };
