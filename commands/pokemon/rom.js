const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const fetch = require('node-fetch');
const FormData = require('form-data');
const { User, PokemonRom } = require('../../libs/database/index');

module.exports = {
  name: 'rom',
  description: 'Apúntate al torneo y obtén una rom randomizada del torneo actual o rerandomiza tu rom.',
  category: 'pokemon',
  args: false,
  cooldown: 5,
  run: async (message) => {
    const { logger } = message.client;
    const userDisc = message.mentions.members.first() || message.member;
    const userId = userDisc.user.id;
    const userAndRom = await Promise.all([
      User.findOne({ where: { userId } }),
      PokemonRom.findOne({ where: { currentlyRunning: true } }),
    ]);
    const user = userAndRom[0];
    const rom = userAndRom[1];
    if (user === null) {
      message.reply('No existes en la base de datos. Contacta con el administrador o yo que sé.');
    }
    if (rom === null) {
      message.reply('No hay ningún torneo activo en este momento.');
      return;
    }
    const { config } = message.client;
    const randomizerRoute = path.resolve(config.randomizerRoute, 'PokeRandoZX.jar');
    try {
      // Check if randomizer exists
      fs.accessSync(randomizerRoute);
      await mkdirp(path.resolve(config.randomizerRoute, userId));
      const randomizedRomRoute = path.resolve(
        config.randomizerRoute,
        userId,
        `${userDisc.user.tag}_${path.basename(rom.currentROMPath)}`,
      );
      const java = spawn('java', ['-jar', randomizerRoute, 'cli', '-l', '-s', rom.currentSettingsPath, '-i', rom.currentROMPath, '-o', randomizedRomRoute]);
      message.reply('¡Gracias por apuntarte al torneo! Tu ROM randomizada se enviará por mensaje directo. ¡Asegúrate de leerte las normas del torneo! Puedes re-randomizar la ROM ejecutándo este commando de nuevo');
      java.stdout.on('data', (data) => {
        logger.log(data);
        // Check if randomized ROM was truly created
        fs.statSync(randomizedRomRoute);
        user.addPokemonRom(rom, { through: { playing: 0 } })
          .then(() => {
            // Upload to external server because it can be pretty heavy
            const formData = new FormData();
            formData.append('files[]', fs.createReadStream(randomizedRomRoute));
            return fetch('https://up1.fileditch.com/upload.php', {
              method: 'POST',
              body: formData,
            });
          })
          .then((res) => res.json())
          .then((json) => {
            logger.log(JSON.stringify(json, null, 2));
            const { url } = json.files[0];
            userDisc.send(`Aquí tienes tu ROM randomizada: ${url}`);
          })
          .catch((err) => {
            logger.error(err);
            message.reply(`No se te ha podido enviar la ROM: ${err}`);
          });
      });
      java.stderr.on('data', (data) => {
        logger.error(data);
        message.reply(`Ha ocurrido un error randomizando la ROM: ${data}`);
      });
    }
    catch (err) {
      message.reply('El ejecutable del randomizer no ha sido encontrado. Avisa al administrador de este problema.');
      logger.error(err);
    }
  },
};
