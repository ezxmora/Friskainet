const { MessageActionRow, MessageButton, Permissions } = require('discord.js');

module.exports = {
  name: 'rules',
  description: 'Comando para administrar las reglas del servidor',
  category: 'moderation',
  usage: '<Opción [add, remove, update]> <Título de la norma>',
  permissions: [Permissions.FLAGS.ADMINISTRATOR],
  cooldown: 5,
  run: async (interaction) => {
    const { database: { Rule }, util, logger } = interaction.client;
    const rules = await Rule.findAll();

    const ruleList = {
      color: util.randomColor(),
      fields: rules.length > 0 ? rules.map((rule) => ({ name: `${rule.ruleId} | ${rule.title}`, value: rule.content })) : [{ name: 'No hay ninguna regla', value: '¯\\_(ツ)_/¯' }],
      thumbnail: {
        url: interaction.client.user.avatarURL({ dynamic: true, format: 'png' }),
      },
    };

    const filters = {
      sameAuthor: (m) => m.author.id === interaction.user.id,
      emojiYesNo: (reaction, user) => ['✔️', '❌'].includes(reaction.emoji.name) && user.id === interaction.user.id,
    };

    const mainOptions = new MessageActionRow()
      .addComponents(new MessageButton().setCustomId('add').setLabel('Añadir').setStyle('PRIMARY'))
      .addComponents(new MessageButton().setCustomId('update').setLabel('Modificar').setStyle('SECONDARY'))
      .addComponents(new MessageButton().setCustomId('remove').setLabel('Borrar').setStyle('DANGER'));

    await interaction.reply({ content: 'Elige una de las opciones:', components: [mainOptions] });

    const mainMenuCollector = interaction.channel.createMessageComponentCollector(
      { filter: (msg) => msg.user.id === interaction.user.id },
    );

    const rulesOptions = {
      add: (inter) => {
        inter.update({
          content: 'Se va a crear una nueva norma, responde a este mensaje con el título y el contenido separados por este limitador `///`.\nActualmente existen estas normas:',
          embeds: [ruleList],
          components: [],
        })
          .then(() => {
            interaction.channel.awaitMessages({ filter: filters.sameAuthor, max: 1 })
              .then((collected) => {
                const userMessageParsed = collected.first().content.split('///');
                Rule.create({
                  title: userMessageParsed[0].trim(),
                  content: userMessageParsed[1].trim(),
                })
                  .then((createdRule) => {
                    logger.db(`Se ha creado una norma con la ID ${createdRule.ruleId}`);
                    return interaction.channel.send({ content: `Se ha creado una norma con la ID \`${createdRule.ruleId}\`` });
                  })
                  .catch((err) => logger.error(`Ha habido un error al intentar crear la norma\n${err}`));
              });
          });
      },

      update: (inter) => {
        inter.update({
          content: 'Se va a modificar una norma, responde a este mensaje con la ID, título y contenido de la norma separador por este limitador `///`.\nActualmente existen estas normas:',
          embeds: [ruleList],
          components: [],
        })
          .then(() => {
            interaction.channel.awaitMessages({ filter: filters.sameAuthor, max: 1 })
              .then(async (collected) => {
                const userMessageParsed = collected.first().content.split('///');

                Rule.findOne({ where: { ruleId: userMessageParsed[0].trim() } })
                  .then((rule) => {
                    if (rule) {
                      const updatedRule = {};
                      if (userMessageParsed.length >= 2) {
                        if (userMessageParsed[1]) updatedRule.title = userMessageParsed[1].trim();
                        if (userMessageParsed[2]) updatedRule.content = userMessageParsed[2].trim();

                        rule.update(updatedRule, { where: rule.ruleId })
                          .then(() => {
                            logger.db(`Se ha actualizado la norma ${rule.ruleId}\``);
                            return interaction.channel.send({ content: `Se ha actualizado la norma \`${rule.ruleId}\`` });
                          })
                          .catch((err) => {
                            logger.error(`Ha habido un error al intentar actualizar la norma:\n${err}`);
                            return interaction.channel.send({ content: 'Ha habido un error al intentar actualizar la norma.' });
                          });
                      }
                      return interaction.channel.send({ content: 'Faltan argumentos para poder modificar la norma.' });
                    }
                    return interaction.channel.send({ content: `No existe ninguna norma con la ID \`${userMessageParsed[0].trim()}\`, vuelve a intentarlo.` });
                  });
              });
          });
      },

      remove: (inter) => {
        inter.update({
          content: 'Se va a borrar una norma, responde a este mensaje con la ID de la misma.\nActualmente existen estas normas:',
          embeds: [ruleList],
          components: [],
        })
          .then(() => {
            interaction.channel.awaitMessages({ filter: filters.sameAuthor, max: 1 })
              .then(async (collected) => {
                const userMessageParsed = collected.first().content;

                Rule.findOne({ where: { ruleId: userMessageParsed.trim() } })
                  .then((rule) => {
                    if (rule) {
                      rule.destroy()
                        .then(() => {
                          logger.db(`La norma con ID ${rule.ruleId} ha sido borrada.`);
                          return interaction.channel.send({ content: `La norma con ID \`${rule.ruleId}\` ha sido borrada.` });
                        })
                        .catch((err) => {
                          logger.error(`Ha habido un error al intentar borrar la norma:\n${err}`);
                          return interaction.channel.send({ content: 'Ha habido un error al intentar borrar la norma.' });
                        });
                    }
                    return interaction.channel.send({ content: 'No se ha encontrado una norma con esa ID' });
                  });
              });
          });
      },
    };

    mainMenuCollector.on('collect', (inter) => {
      if (inter.customId.match(/add|update|remove/g)) {
        return rulesOptions[inter.customId](inter);
      }
      return interaction.reply({ content: 'No sé cómo lo habrás hecho, pero has seleccionado una opción que no existe' });
    });
  },
};
