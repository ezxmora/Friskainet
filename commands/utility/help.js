module.exports = {
  name: 'help',
  description: 'Lista todos los comandos o información específica de uno',
  category: 'utility',
  cooldown: 2,
  async run(interaction) {
    const { commands, logger, util } = interaction.client;

    const categories = [...new Set(commands.map((cmd) => cmd.category))];
    const commandList = [];

    categories.forEach((cat) => {
      const categoryObject = { name: cat.charAt(0).toUpperCase() + cat.slice(1), value: [] };
      commands.forEach((c) => {
        if (c.category === cat) {
          categoryObject.value.push(`\`${c.name}\``);
        }
      });
      categoryObject.name = `${categoryObject.name} - ${categoryObject.value.length}`;
      categoryObject.value = categoryObject.value.join(', ');
      commandList.push(categoryObject);
    });

    const embed = {
      color: util.randomColor(),
      title: 'Comandos del bot',
      fields: commandList,
    };

    return interaction.member.send({ embeds: [embed] })
      .then(() => interaction.reply({ content: 'Te he mandado un DM con todos mis comandos', ephemeral: true }))
      .catch((error) => {
        logger.error(`No le he podido mandar un DM a ${interaction.user.tag}.\n${error}`);
        return interaction.reply({ content: 'Parece que no te puedo mandar un DM. ¿Los tienes desactivados?', ephemeral: true });
      });
  },
};
