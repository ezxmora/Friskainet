module.exports = {
  name: 'threadCreate',
  once: false,
  execute: async (thread) => {
    await thread.join();
  },
};
