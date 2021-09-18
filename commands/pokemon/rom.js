const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');
const os = require('os');

module.exports = {
  name: 'rom',
  description: 'Apúntate al torneo y obtén una rom randomizada del torneo actual o rerandomiza tu rom.',
  category: 'pokemon',
  cooldown: 5,
  run: async (interaction) => {
    const { logger, config, database: { User, PokemonRom } } = interaction.client;
    const userMember = interaction.member;
    const userAndRom = await Promise.all([
      User.findOne({ where: { userId: userMember.id } }),
      PokemonRom.findOne({ where: { currentlyRunning: true } }),
    ]);
    const user = userAndRom[0];
    const rom = userAndRom[1];
    if (user === null) return interaction.reply('No existes en la base de datos. Contacta con el administrador o yo que sé.');

    if (rom === null) return interaction.reply('No hay ningún torneo activo en este momento.');

    const randomizerRoute = path.resolve(config.randomizerRoute, 'PokeRandoZX.jar');
    try {
      // Check if randomizer exists
      fs.accessSync(randomizerRoute);
      const tmpPath = path.resolve(os.tmpdir());
      const baseRom = path.resolve(tmpPath, rom.name);
      const randSettings = path.resolve(tmpPath, 'tmpconfig.rnqs');
      const destRom = fs.createWriteStream(baseRom);
      const destSettings = fs.createWriteStream(randSettings);
      const randomizedRomRoute = path.resolve(
        tmpPath,
        `${interaction.user.tag}_${rom.name}`,
      );
      Promise.all([
        fetch(rom.currentROMPath), fetch(rom.currentSettingsPath)])
        .then((randomizerFiles) => Promise.all([
          new Promise((resolve, reject) => {
            randomizerFiles[0].body.pipe(destRom);
            randomizerFiles[0].body.on('error', reject);
            destRom.on('finish', resolve);
          }),
          new Promise((resolve, reject) => {
            randomizerFiles[1].body.pipe(destSettings);
            randomizerFiles[1].body.on('error', reject);
            destSettings.on('finish', resolve);
          }),
        ]))
        .then(() => {
          const java = spawn('java', ['-jar', randomizerRoute, 'cli', '-l', '-s', randSettings, '-i', baseRom, '-o', randomizedRomRoute]);
          java.stdout.on('data', (data) => {
            logger.log(data);
            // Check if randomized ROM was truly created
            fs.statSync(randomizedRomRoute);
            // Upload to external server because it can be pretty heavy
            const formData = new FormData();
            formData.append('files[]', fs.createReadStream(randomizedRomRoute));
            let url;
            fetch('https://up1.fileditch.com/upload.php', {
              method: 'POST',
              body: formData,
            }).then((res) => res.json())
              .then((json) => {
                logger.log(JSON.stringify(json, null, 2));
                url = json.files[0].url;
                return user.addPokemonRom(rom, { through: { playing: 0, romURL: url } });
              })
              .then(() => {
                userMember.send(`Aquí tienes tu ROM randomizada: ${url}`);
              })
              .catch((err) => {
                logger.error(err);
                return interaction.reply(`No se te ha podido enviar la ROM: ${err}`);
              });
          });
          java.stderr.on('data', (data) => {
            logger.error(data);
            return interaction.reply(`Ha ocurrido un error randomizando la ROM: ${data}`);
          });
        });
    }
    catch (err) {
      logger.error(err);
      return interaction.reply('El ejecutable del randomizer no ha sido encontrado. Avisa al administrador de este problema.');
    }

    return interaction.reply('¡Gracias por apuntarte al torneo! Tu ROM se está randomizando y se enviará por mensaje directo. ¡Asegúrate de leerte las normas del torneo! Puedes re-randomizar la ROM ejecutándo este commando de nuevo');
  },
};
