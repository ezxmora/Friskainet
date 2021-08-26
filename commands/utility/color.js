module.exports = {
  name: 'color',
  description: 'Asigna un rol con el color especificado',
  options: [{
    name: 'color',
    type: 'STRING',
    description: 'Color en formato hexadecimal, #123123',
    required: false,
  }],
  category: 'utility',
  cooldown: 30,
  run: async (interaction) => {
    const { util, logger } = interaction.client;
    const coloredRoles = await interaction.guild.roles.cache.filter((role) => role.name.includes('color-'));
    const color = interaction.options.getString('color');

    if (color) {
      if (util.isAColor(color)) {
        const colorRoleName = `color-${color.substring(1, color.length).toUpperCase()}`;
        const colorRoleExists = coloredRoles.find((r) => r.name === colorRoleName);
        let colorRole;

        try {
          if (!colorRoleExists) {
            colorRole = await interaction.guild.roles.create({
              name: colorRoleName,
              color,
              reason: `${interaction.member.user.tag} ha creado el color ${color}`,
            });
          }
          else {
            colorRole = colorRoleExists;
          }

          // Checks if an user has a role with color
          if (interaction.member.color) {
            await interaction.member.roles.remove(interaction.member.color);
            await interaction.member.roles.add(colorRole);
          }
          else {
            await interaction.member.roles.add(colorRole);
          }

          return interaction.reply({ content: `Se te ha asignado <@&${colorRole.id}>` });
        }
        catch (error) {
          logger.error(`Ha habido un error al establecer los colores:\n${error}`);
        }
      }
      else {
        return interaction.reply({ content: 'Ese no es un color válido, tienes que introducir un número en formato hexadecimal `#123123`' });
      }
    }
    else {
      return interaction.reply({
        embeds: [{
          color: util.randomColor(),
          fields: [{
            name: 'Lista de colores disponibles:',
            value: coloredRoles.map((r) => `<@&${r.id}>`).join(','),
          }],
        }],
      });
    }
  },
};

