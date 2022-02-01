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
    const { util: { randomColor, progressBarGenerator } } = interaction.client;
    const user = interaction.options.getMember('usuario') || interaction.member;
    if (user.bot) return interaction.reply({ content: 'No puedes usar este comando con bots' });

    const databaseInfo = await interaction.client.userInfo(user.id);
    const roles = await user.roles.cache.map((role) => `<@&${role.id}>`);
    roles.pop();

    const nextLevel = databaseInfo.level + 1;
    const neededExperience = 500 * (nextLevel ** 2) - (500 * nextLevel);
    const experiencePercentage = (100 * databaseInfo.experience) / neededExperience;

    const embed = {
      color: randomColor(),
      title: user.user.tag,
      thumbnail: { url: user.user.avatarURL({ dynamic: true, format: 'png' }) },
      fields: [
        { name: '**Apodo:**', value: user.nickname || 'No tiene', inline: true },
        { name: '**Nivel:**', value: `${databaseInfo.level}`, inline: true },
        { name: '**Experiencia:**', value: `${databaseInfo.experience}/${neededExperience} - ${experiencePercentage}%\n${progressBarGenerator(experiencePercentage, 20)}` },
        { name: '**Balance:**', value: `${databaseInfo.balance} tokens` },
        { name: `**Role(s):** - ${roles.length}`, value: roles.join(','), inline: false },
        { name: `**Warn(s):** - ${databaseInfo.warns.length || 0}`, value: databaseInfo.warns.map((w) => `\`${w.reason}\``).join(',') || 'Ninguno', inline: false },
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
      footer: { text: `ID: ${user.id}` },
    };
    return interaction.reply({ embeds: [embed] });
  },
};
