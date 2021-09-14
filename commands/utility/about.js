const moment = require('moment');

module.exports = {
  name: 'about',
  description: 'Obtiene toda la información de un usuario',
  options: [{
    name: 'usuario',
    type: 'USER',
    description: 'Usuario del que obtener información',
    required: false,
  }],
  category: 'utility',
  run: async (interaction) => {
    const user = interaction.options.getMember('usuario') || interaction.member;
    if (user.bot) return interaction.reply({ content: 'No puedes usar este comando con bots' });

    const userInfo = await interaction.client.userInfo(user.id);
    const roles = await user.roles.cache.map((role) => `<@&${role.id}>`);
    roles.pop();

    const embed = {
      color: interaction.client.util.randomColor(),
      title: user.user.tag,
      thumbnail: { url: user.user.avatarURL({ dynamic: true, format: 'png' }) },
      fields: [
        { name: '**ID:**', value: user.id },
        { name: '**Balance:**', value: `${userInfo.balance} tokens`, inline: true },
        { name: '**Apodo:**', value: user.nickname || 'No tiene', inline: true },
        { name: `**Role(s):** - ${roles.length}`, value: roles.join(','), inline: false },
        { name: `**Warn(s):** - ${userInfo.warns.length || 0}`, value: userInfo.warns.map((w) => `\`${w.reason}\``).join(',') || 'Ninguno', inline: false },
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
    return interaction.reply({ embeds: [embed] });
  },
};
