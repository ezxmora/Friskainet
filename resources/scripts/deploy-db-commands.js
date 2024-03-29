process.title = 'Friskainet - Deploy commands & database script';

require('module-alias/register');
const { GatewayIntentBits, SlashCommandBuilder, REST, Routes, PermissionFlagsBits } = require('discord.js');

const Friskainet = require('@bot/Friskainet');
const { token, guildID, applicationID } = require('@config');

const bot = new Friskainet({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Database and slash commands deployment
bot.login(token).then(async () => {
  const {
    database: {
      User, Command, Stat, syncAll,
    }, logger,
  } = bot;

  syncAll(async () => {
    const commands = [
      new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Recibe la cantidad diaria de tokens'),
      new SlashCommandBuilder()
        .setName('dice')
        .setDescription('Tira unos dados')
        .addIntegerOption((i) => i.setName('dados').setDescription('Número de dados')
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(10))
        .addIntegerOption((i) => i.setName('apuesta').setDescription('Cantidad a apostar')
          .setRequired(true)
          .setMinValue(1))
        .addIntegerOption((i) => i.setName('cara').setDescription('Cara del dado a adivinar')
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(6)),
      new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Muestra el top 3 de las personas más ricas del servidor'),
      new SlashCommandBuilder()
        .setName('mug')
        .setDescription('Roba o no algunos tokens a un usuario')
        .addUserOption((u) => u.setName('usuario').setDescription('Usuario al que robar').setRequired(true)),
      new SlashCommandBuilder()
        .setName('slot')
        .setDescription('Hace una tirada en la tragaperras')
        .addIntegerOption((i) => i.setName('lineas').setDescription('Cantidad de líneas para tirar en la tragaperras')
          .setRequired(true)
          .addChoices({ name: '3', value: 3 }, { name: '5', value: 5 }, { name: '7', value: 7 }, { name: '9', value: 9 }))
        .addIntegerOption((i) => i.setName('apuesta').setDescription('Cantidad a apostar')
          .setRequired(true)
          .setMinValue(1)),
      new SlashCommandBuilder()
        .setName('bizum')
        .setDescription('Envía tokens a otro usuario')
        .addUserOption((u) => u.setName('usuario').setDescription('Usuario al que transferir monedas').setRequired(true))
        .addIntegerOption((i) => i.setName('cantidad').setDescription('Cantidad de tokens a transferir')
          .setRequired(true)
          .setMinValue(1)),
      new SlashCommandBuilder().setName('kanye').setDescription('Devuelve una frase de Kanye West'),
      new SlashCommandBuilder()
        .setName('urban')
        .setDescription('Hace una búsqueda en UrbanDictionary')
        .addStringOption((s) => s.setName('termino').setDescription('Término a buscar').setRequired(true)),
      new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Borra los mensajes que cumplan cierto criterio')
        .addIntegerOption((i) => i.setName('cantidad').setDescription('Cantidad de mensajes a borrar')
          .setRequired(true)
          .setMinValue(0))
        .addStringOption((s) => s.setName('criterio').setDescription('Criterio con el que se borrarán los mensajes, se pueden usar expresiones regulares').setRequired(false)),
      new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Desconecta a un usuario de un canal de voz')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption((u) => u.setName('usuario').setDescription('Usuario a desconectar').setRequired(true)),
      new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Le añade un warn a un usuario')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption((u) => u.setName('usuario').setDescription('Usuario al que añadir el aviso').setRequired(true))
        .addStringOption((s) => s.setName('motivo').setDescription('Motivo por el que se sanciona al usuario').setRequired(true)),
      new SlashCommandBuilder().setName('clear').setDescription('Vacía la cola de canciones'),
      new SlashCommandBuilder().setName('leave').setDescription('Hace que el bot se vaya del canal de voz'),
      new SlashCommandBuilder().setName('pause').setDescription('Pausa lo que está sonando actualmente en el bot'),
      new SlashCommandBuilder()
        .setName('play')
        .setDescription('Reproduce o añade una canción a la cola')
        .addStringOption((s) => s.setName('cancion').setDescription('La URL o título de la canción').setRequired(true)),
      new SlashCommandBuilder().setName('queue').setDescription('Muestra la cola de canciones'),
      new SlashCommandBuilder().setName('resume').setDescription('Continua lo que estaba sonando en el bot'),
      new SlashCommandBuilder().setName('skip').setDescription('Salta la canción que está sonando'),
      new SlashCommandBuilder()
        .setName('about')
        .setDescription('Obtiene toda la información de un usuario')
        .addUserOption((u) => u.setName('usuario').setDescription('Usuario del que obtener información').setRequired(true)),
      new SlashCommandBuilder()
        .setName('color')
        .setDescription('Envía una foto de unos pechos')
        .addStringOption((s) => s.setName('color').setDescription('Color en formato hexadecimal, #123123').setRequired(false)),
      new SlashCommandBuilder().setName('help').setDescription('Lista todos los comandos o información específica de uno'),
      new SlashCommandBuilder()
        .setName('lmgtfy')
        .setDescription('Crea una búsqueda en Let Me Google That')
        .addStringOption((s) => s.setName('busqueda').setDescription('Término a buscar').setRequired(true)),
      new SlashCommandBuilder()
        .setName('poke')
        .setDescription('Manda un DM a un usuario con un mensaje')
        .addUserOption((u) => u.setName('usuario').setDescription('Usuario al que pokear').setRequired(true))
        .addStringOption((s) => s.setName('mensaje').setDescription('Mensaje a enviar').setRequired(false)),
      new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Baraja y divide en grupos una serie de elementos')
        .addIntegerOption((i) => i.setName('grupos').setDescription('Número de grupos').setRequired(true))
        .addStringOption((s) => s.setName('items').setDescription('Items a barajar separados por comas').setRequired(true)),
      new SlashCommandBuilder()
        .setName('nsfw')
        .setDescription('Envía imágenes nsfw')
        .addSubcommand((sbc) => sbc.setName('ass').setDescription('Envía una foto de un culo'))
        .addSubcommand((sbc) => sbc.setName('boobs').setDescription('Envía una foto de unos pechos')),
    ].map((command) => command.toJSON());

    // Adds all Friskainet's commands
    const rest = new REST({ version: '10' }).setToken(token);
    await rest.put(Routes.applicationGuildCommands(applicationID, guildID), { body: commands })
      .then(() => bot.logger.log('Se han añadido todos los comandos correctamente'))
      .catch((error) => bot.logger.error(`Ha habido un error al intentar añadir un comando ${error}`));

    // Adds all commands to the database
    commands.forEach((command) => {
      Command.create({ name: command.name })
        .then((result) => logger.db(`Se ha añadido el comando ${result.name} a la base de datos`))
        .catch((err) => logger.error(err));
    });

    // Create server stats
    Stat.create({ server: guildID })
      .then(() => logger.db('Se han creado las estadísticas del servidor'))
      .catch((err) => logger.error(err));

    // Fetchs and adds users to the database
    const users = await bot.getAllUsers();

    users.forEach((member) => {
      User.create({ userId: member.user.id })
        .then((result) => logger.db(`[${member.guild.name}] - [${result.userId}] - ${member.user.tag} ha sido añadid@ a la base de datos`))
        .catch((err) => logger.error(err));
    });
  });
});
