module.exports = {
  name: 'error',
  once: false,
  execute: async (_, error, bot) => {
    bot.logger.log(`Ha habido un error en el reproductor: \n${error}`);
  },
};
