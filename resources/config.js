module.exports = {
  discordToken: process.env.FRISKAINET_TOKEN,
  channels: {
    volatile: process.env.FRISKAINET_VOLATILE_CHANNEL,
    pinneds: process.env.FRISKAINET_PINS_CHANNEL,
    logs: process.env.FRISKAINET_LOGS_CHANNEL,
  },
  adminRole: process.env.FRISKAINET_ADMIN_ROLE,
  betRatio: process.env.FRISKAINET_BETTING_RATIO,
  databaseURL: process.env.FRISKAINET_DATABASE_URL,
  voicerssToken: process.env.FRISKAINET_VOICERSS,
  spotify: {
    clientId: process.env.FRISKAINET_SPOTIFY_CLIENTID,
    clientSecret: process.env.FRISKAINET_SPOTIFY_CLIENTSECRET,
  },
  presence: {
    // Anything you want here
    name: 'Konchinpiro',
    // Check https://discord.js.org/#/docs/main/stable/typedef/ActivityType
    type: 'PLAYING',
    // Check https://discord.js.org/#/docs/main/stable/typedef/ClientPresenceStatus
    status: 'online',
  },
  randomizerRoute: process.env.FRISKAINET_RANDOMIZER_ROUTE,
  pokemonRole: process.env.FRISKAINET_POKEMON_ROLE_ID,
  challongeUsername: process.env.FRISKAINET_CHALLONGE_USERNAME,
  challongeApiKey: process.env.FRISKAINET_CHALLONGE_API_KEY,
};
