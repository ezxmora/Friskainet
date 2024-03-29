module.exports = {
  name: 'purgeVolatile',
  expression: '0 0 4 * * *',
  run: async (bot) => {
    const { channels: { volatile } } = bot.config;
    const oldChannel = bot.channels.cache.find((channel) => channel.name === volatile);
    await oldChannel.clone();
    await oldChannel.delete('Purging channels');
    bot.logger.log(`Se ha purgado el canal ${volatile} y se ha creado el hilo NSFW`);
  },
};
