module.exports = {
  discordToken: process.env.FRISKAINET_TOKEN,
  prefix: process.env.FRISKAINET_PREFIX,
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
  presence: {
    name: process.env.FRISKAINET_PRESENCE_NAME,
    type: process.env.FRISKAINET_PRESENCE_TYPE.toUpperCase(),
    status: process.env.FRISKAINET_PRESENCE_STATUS.toLowerCase(),
  },
  greetings: [
    'Sup {{user}}?',
  ],
};
