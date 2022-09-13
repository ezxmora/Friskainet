const fetch = require('node-fetch');
const { RouteBases, Routes, InviteTargetType } = require('discord-api-types/v10');
// Voice activity list
// https://gist.github.com/GeneralSadaf/42d91a2b6a93a7db7a39208f2d8b53ad

module.exports = {
  name: 'activities',
  description: 'Empieza o inicia una actividad en un canal de voz',
  category: 'fun',
  cooldown: 5,
  run: async (interaction) => {
    const { token } = interaction.client;
    const voiceChannel = interaction.member?.voice.channel;
    const activity = interaction.options?.getString('actividad');

    if (!voiceChannel) return interaction.reply({ content: 'Tienes que estar en un canal de voz' });

    return fetch(`${RouteBases.api}${Routes.channelInvites(voiceChannel.id)}`, {
      method: 'POST',
      headers: { authorization: `Bot ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        max_age: 86400,
        target_type: InviteTargetType.EmbeddedApplication,
        target_application_id: activity,
      }),
    })
      .then(async (response) => {
        const r = await response.json();
        interaction.reply({ content: `Únete a la actividad (${r.target_application.name}) haciendo click [aquí](https://discord.gg/${r.code})` });
      })
      .catch((err) => console.log(err));
  },
};
