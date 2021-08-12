module.exports = {
  discordToken: process.env.FRISKAINET_TOKEN,
  channels: {
    welcome: process.env.FRISKAINET_WELCOME_CHANNEL,
    volatile: process.env.FRISKAINET_VOLATILE_CHANNEL,
  },
  adminRole: process.env.FRISKAINET_ADMIN_ROLE,
  betRatio: process.env.FRISKAINET_BETTING_RATIO,
  voicerssToken: process.env.FRISKAINET_VOICERSS,
  database: {
    databaseName: process.env.FRISKAINET_DATABASE_NAME,
    username: process.env.FRISKAINET_DATABASE_USERNAME,
    password: process.env.FRISKAINET_DATABASE_PASSWORD,
    host: process.env.FRISKAINET_DATABASE_HOST,
    dialect: process.env.FRISKAINET_DATABASE_DIALECT.toLowerCase(),
  },
  guilds: ['LIST OF YOUR GUILD IDs'],
  presence: {
    // Anything you want here
    name: 'Hey, I\'m running Friskainet',
    // Check https://discord.js.org/#/docs/main/stable/typedef/ActivityType
    type: 'CUSTOM',
    // Check https://discord.js.org/#/docs/main/stable/typedef/ClientPresenceStatus
    status: 'online',
  },
  greetings: [
    'Sup {{user}}?',
  ],
  randomizerRoute: process.env.FRISKAINET_RANDOMIZER_ROUTE
};
