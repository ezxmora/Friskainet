module.exports = {
  name: 'rules',
  description: '',
  category: 'moderation',
  args: true,
  usage: '<Opción [add, remove, update]> <Título de la norma>',
  permissions: 'ADMINISTRATOR',
  cooldown: 5,
  run: async (message, args) => {
    const { database: { Rule, Op }, util: { randomColor }, logger } = message.client;
    const option = args[0].toLowerCase();
    const ruleTitle = args.slice(1).join(' ');
    const ruleExists = await Rule.findOne({ where: { title: { [Op.like]: `%${ruleTitle}%` } } });

    const filters = {
      sameAuthor: (msg) => msg.author.id === message.author.id,
      emojiYesNo: (reaction, user) => ['✔️', '❌'].includes(reaction.emoji.name) && user.id === message.author.id,
    };

    const rulesOptions = {
      add: () => {
        if (!ruleExists) {
          message.reply('OK, ese será el título de la norma, ahora introduce el contenido:')
            .then(() => {
              message.channel.awaitMessages(filters.sameAuthor, { max: 1, time: 30000, errors: ['time'] })
                .then((response) => {
                  const ruleContent = response.first().content;
                  if (ruleContent) {
                    message.reply({ embed: { color: randomColor(), title: '¿Está todo correcto?', fields: [{ name: ruleTitle, value: ruleContent }] } })
                      .then(async (m) => {
                        await m.react('✔️');
                        await m.react('❌');

                        m.awaitReactions(filters.emojiYesNo, { max: 1, time: 30000, errors: ['time'] })
                          .then((collected) => {
                            const reaction = collected.first();
                            if (reaction.emoji.name === '✔️') {
                              try {
                                Rule.create({ title: ruleTitle, content: ruleContent });
                                message.channel.send('Se ha añadido la norma a la base de datos');
                                logger.db(`${ruleTitle} ha sido añadido a la base de datos`);
                              }
                              catch (err) {
                                logger.error(err);
                              }
                            }
                          })
                          .catch(() => message.channel.send('Has superado el tiempo de espera, vuelve a empezar'));
                      });
                  }
                })
                .catch(() => message.channel.send('Has superado el tiempo de espera, vuelve a empezar'));
            });
        }
        else {
          message.reply('Una norma con ese título ya existe');
        }
      },

      update: () => {
        if (ruleExists) {
          const { title, content } = ruleExists;

          message.reply({ embed: { color: randomColor(), description: 'Utiliza ✔️ para modificar el título y ❌ para modificar la descripción', fields: [{ name: title, value: content }] } })
            .then(async (m) => {
              await m.react('✔️');
              await m.react('❌');

              m.awaitReactions(filters.emojiYesNo, { max: 1, time: 30000, errors: ['time'] })
                .then((collected) => {
                  const reaction = collected.first();

                  if (reaction.emoji.name === '✔️') {
                    message.channel.awaitMessages(filters.sameAuthor, { max: 1, time: 30000, errors: ['time'] })
                      .then((response) => {
                        const newTitle = response.first().content;
                        ruleExists.update({ title: newTitle })
                          .then((result) => {
                            logger.db(`Se ha modificado una norma (${result.title})`);
                            message.reply(`La norma con el título \`${title}\` ahora es \`${result.title}\``);
                          })
                          .catch((err) => logger.error(err));
                      })
                      .catch(() => message.reply('Has superado el tiempo de espera, vuelve a empezar'));
                  }
                  else {
                    message.channel.awaitMessages(filters.sameAuthor, { max: 1, time: 30000, errors: ['time'] })
                      .then((response) => {
                        const newContent = response.first().content;
                        ruleExists.update({ content: newContent })
                          .then((result) => {
                            logger.db(`Se ha modificado una norma (${result.content})`);
                            message.reply(`La norma con el contenido \`${content}\` ahora es \`${result.content}\``);
                          })
                          .catch((err) => logger.error(err));
                      })
                      .catch(() => message.reply('Has superado el tiempo de espera, vuelve a empezar'));
                  }
                })
                .catch(() => message.reply('Has superado el tiempo de espera, vuelve a empezar'));
            });
        }
        else {
          message.reply('No existe una norma con algo así en el título');
        }
      },

      remove: () => {
        if (ruleExists) {
          const { title, content } = ruleExists;

          message.reply({ embed: { color: randomColor(), title: '¿Deseas borrar esta norma?', fields: [{ name: title, value: content }] } })
            .then(async (m) => {
              await m.react('✔️');
              await m.react('❌');

              m.awaitReactions(filters.emojiYesNo, { max: 1, time: 30000, errors: ['time'] })
                .then((collected) => {
                  const reaction = collected.first();

                  if (reaction.emoji.name === '✔️') {
                    ruleExists.destroy()
                      .then((result) => {
                        message.reply('La norma se ha borrado correctamente');
                        logger.db(`Se ha borrado una norma (${result.title})`);
                      })
                      .catch((err) => logger.error(err));
                  }
                })
                .catch(() => message.reply('Has superado el tiempo de espera, vuelve a empezar'));
            });
        }
      },
    };

    if (option.match(/add|update|remove/g)) {
      return rulesOptions[option]();
    }

    return message.reply('El primer argumento no es una opción válida');
  },
};
