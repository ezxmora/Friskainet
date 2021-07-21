const { createWriteStream, existsSync } = require('fs');
const fetch = require('node-fetch');
const { playSound } = require('./voice');
const logger = require('./logger');
const { voicerssToken } = require('../resources/config');

const tts = (text, path) => {
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
      .then((response) => response.body.pipe(writable))
      .catch((err) => logger.error(`Ha habido un error al recuperar el archivo:\n${err}`));
  });
};

module.exports = {
  userJoined: async (voiceState, player) => {
    const { member } = voiceState;
    try {
      const path = await tts(`${member.user.username} se unió al canal`, `${global.basedir}/resources/voice/join/${member.id}.mp3`);
      playSound(player, path);
    }
    catch (error) {
      logger.error(`Ha habido un error al procesar el audio de join de ${member.user.username} (${member.id}.mp3)\n${error}`);
    }
  },

  userLeft: async (voiceState, player) => {
    const { member } = voiceState;
    try {
      const path = await tts(`${member.user.username} abandonó el canal`, `${global.basedir}/resources/voice/leave/${member.id}.mp3`, true);
      playSound(player, path);
    }
    catch (error) {
      logger.error(`Ha habido un error al procesar el audio leave de ${member.user.username} (${member.id}.mp3)\n${error}`);
    }
  },

  saySomething: async (text, voiceState, player) => {
    const filename = Math.random().toString(36).substring(7);
    try {
      const path = await tts(text, `${global.basedir}/resources/voice/say/${filename}.mp3`, true);
      playSound(player, path);
    }
    catch (error) {
      logger.error(`Ha habido un error al procesar el audio de ${filename} (${filename}.mp3)\n${error}`);
    }
  },
};
