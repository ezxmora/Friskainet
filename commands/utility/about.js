const moment = require('moment');

module.exports = {
  name: 'about',
  description: 'Obtiene toda la información de un usuario',
  category: 'utility',
  usage: '[Usuario]',
  run: async (message) => {
    moment.locale('es');
    const user = message.mentions.members.first() || message.member;
    const userInfo = await user.info;
    const roles = await user.roles.cache.map((role) => `<@&${role.id}>`);
    roles.pop();
    const warns = await user.warns.then((warnings) => warnings.map((warning) => `\`${warning.reason}\``));

    const embed = {
      color: message.client.util.randomColor(),
      title: user.user.tag,
      thumbnail: { url: user.user.avatarURL({ dynamic: true, format: 'png' }) },
      fields: [
        { name: '**ID:**', value: user.user.id },
        { name: '**Balance:**', value: userInfo.balance, inline: true },
        { name: '**Apodo:**', value: user.nickname || 'No tiene', inline: true },
        { name: `**Role(s):** - ${roles.length}`, value: roles.join(','), inline: false },
        { name: `**Warn(s):** - ${warns.length || 0}`, value: warns.join(',') || 'Ninguno', inline: false },
        {
          name: '**Fecha de ingreso:**',
          value: `${moment(user.joinedTimestamp).format('D MMM YYYY, HH:m:ss')} - ${moment(user.joinedTimestamp).fromNow()}`,
          inline: false,
        },
        {
          name: '**Fecha de creación:**',
          value: `${moment(user.user.createdTimestamp).format('D MMM YYYY, HH:m:ss')} - ${moment(user.user.createdTimestamp).fromNow()}`,
          inline: false,
        },
      ],
    };
    message.channel.send({ embeds: [embed] });
  },
};
