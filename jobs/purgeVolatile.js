module.exports = {
  name: 'purgeVolatile',
  expression: '0 0 4 * * *',
  run: async (bot) => {
    const { channels: { volatile } } = bot.config;
    const oldChannel = bot.channels.cache.find((channel) => channel.name === volatile);
    // const newChannel = await oldChannel.clone();
    await oldChannel.clone();
    await oldChannel.delete('Purging channels');
    // await newChannel.threads.create({
    //   name: 'NSFW',
    //   autoArchiveDuration: 1440,
    //   reason: 'Para la comodidad del pueblo',
    // });
    bot.logger.log(`Se ha purgado el canal ${volatile} y se ha creado el hilo NSFW`);
  },
};
