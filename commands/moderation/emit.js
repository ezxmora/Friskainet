module.exports = {
  name: 'emit',
  description: 'Testing emit',
  category: 'moderation',
  args: true,
  usage: '<Nombre del evento>',
  permissions: 'ADMINISTRATOR',
  cooldown: 10,
  run: async (message, args) => {
    message.client.emit(args[0], message.member, null);
  },
};
