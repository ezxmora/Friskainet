const { ActivityType } = require('discord.js');

module.exports = {
  // If you want to see some extra output
  debug: false,
  // Only works with debug enabled
  ownerID: 'BOT OWNER ID',
  guildID: 'GUILD ID',
  applicationID: 'YOUR APPLICATION ID',
  token: process.env.FRISKAINET_TOKEN ?? 'DISCORD TOKEN',
  roleAssignerMessageId: 'MESSAGE TO ASSIGN ROLES',
  channels: {
    volatile: 'VOLATILE CHANNEL NAME',
    pinneds: 'PINS CHANNEL NAME',
    logs: 'LOGS CHANNEL NAME',
    serverInfoId: 'SERVER INFO ID',
  },
  roles: {
    admin: 'Admin Role Name',
    vip: 'Vip Role Name',
    random: 'Normal user Role Name',
    pokemon: 'Pokemon Admin Role Name',
  },
  betRatio: 'BETTING SYSTEM PROFIT RATIO',
  databaseURL: process.env.FRISKAINET_DATABASE_URL ?? 'DATABASE URL',
  voicerssToken: process.env.FRISKAINET_VOICERSS ?? 'VOICE RSS TOKEN',
  spotify: {
    clientId: process.env.FRISKAINET_SPOTIFY_CLIENTID ?? 'SPOTIFY CLIENT ID',
    clientSecret: process.env.FRISKAINET_SPOTIFY_CLIENTSECRET ?? 'SPOTIFY CLIENT SECRET',
  },
  presence: {
    name: 'Anything you want here',
    // Check https://discord.js.org/#/docs/main/stable/typedef/ActivityType
    type: ActivityType.Listening,
    // Check https://discord.js.org/#/docs/main/stable/typedef/ClientPresenceStatus
    status: 'online',
  },
  randomizerRoute: process.env.FRISKAINET_RANDOMIZER_ROUTE ?? 'POKEMON RANDOMIZER ROUTE',
  challongeUsername: 'YOUR CHALLONGE USERNAME',
  challongeApiKey: process.env.FRISKAINET_CHALLONGE_API_KEY ?? 'YOUR CHALLONGE API KEY',
};
