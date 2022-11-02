const { resolveColor } = require('discord.js');

module.exports = {
  name: 'queue',
  description: 'Muestra la cola de canciones',
  category: 'music',
  cooldown: 2,
  run: async (interaction) => {
    await interaction.deferReply();
    const { player, util: { randomColor } } = interaction.client;
    const queue = player.getQueue(interaction.guildId);

    if (queue) {
      if (queue.songs.length === 0) return interaction.editReply({ content: 'No hay nada en la cola' });

      const playing = queue.songs[0];
      const queueMap = await queue.songs.map((song, index) => `${index + 1}. ${song.name}`).join('\n');
      const embedObject = {
        title: 'Cola de canciones',
        color: resolveColor(randomColor()),
        description: `**Está sonando: ** ${playing.name}\n**En la cola:\n**${queueMap}`,
      };
      return interaction.editReply({ embeds: [embedObject] });
    }

    return interaction.editReply({ content: 'No hay nada en la cola' });
  },
};
