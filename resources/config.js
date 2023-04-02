require('dotenv').config();

module.exports = {
  ownerID: process.env.FRISKAINET_OWNERID,
  guildID: process.env.FRISKAINET_GUILDID,
  applicationID: process.env.FRISKAINET_APPID,
  token: process.env.FRISKAINET_TOKEN,
  roleAssignerMessageId: process.env.FRISKAINET_ROLE_MESSAGEID,
  channels: {
    serverInfoId: process.env.FRISKAINET_CHANNEL_INFOID,
    volatile: process.env.FRISKAINET_CHANNEL_VOLATILE,
    pinneds: process.env.FRISKAINET_CHANNEL_PINNEDS,
    logs: process.env.FRISKAINET_CHANNEL_LOGS,
  },
  roles: {
    admin: process.env.FRISKAINET_ROLE_ADMIN,
    vip: process.env.FRISKAINET_ROLE_VIP,
    random: process.env.FRISKAINET_ROLE_RANDOM,
  },
  betRatio: process.env.FRISKAINET_BETRATIO,
  databaseURL: process.env.FRISKAINET_DATABASE,
};
