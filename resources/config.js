module.exports = {
    discordToken: process.env.FRISKAINET_TOKEN,
    prefix: process.env.FRISKAINET_PREFIX,
    database: {
        something: 'stomething',
    },
    presence: {
        name: process.env.FRISKAINET_PRESENCE_NAME,
        type: process.env.FRISKAINET_PRESENCE_TYPE.toUpperCase(),
        status: process.env.FRISKAINET_PRESENCE_STATUS.toLowerCase(),
    },
    welcomeChannel: process.env.FRISKAINET_WELCOME_CHANNEL,
    adminRole: process.env.FRISKAINET_ADMIN_ROLE,
    language: process.env.FRISKAINET_BOT_LANGUAGE,
    betRatio: process.env.FRISKAINET_BET_RATIO,
    greetings: [
        "Sup {{user}}?"
    ]
};