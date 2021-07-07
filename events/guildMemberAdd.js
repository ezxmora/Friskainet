const Canvas = require('canvas');
const { MessageAttachment } = require('discord.js');

const applyText = (canvas, text) => {
  const ctx = canvas.getContext('2d');
  let fontSize = 70;

  do {
    ctx.font = `${(fontSize -= 10)}px Segoe UI Symbol`;
  } while (ctx.measureText(text).width > canvas.width - 300);

  return ctx.font;
};

module.exports = {
  name: 'guildMemberAdd',
  once: false,
  execute: async (member, bot) => {
    const defaultChannel = member.guild.channels.cache.find((c) => c.name === bot.config.welcomeChannel);

    const greetings = bot.config.greetings[Math.floor(Math.random() * bot.config.greetings.length)];

    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('./resources/img/bg.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = '28px Segoe UI Symbol';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    // User joined to the server
    ctx.strokeText(`${member.displayName} se ha unido al servidor`, canvas.width / 2.5, canvas.height / 2.5);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${member.displayName} se ha unido al servidor`, canvas.width / 2.5, canvas.height / 2.5);
    // User name
    ctx.font = applyText(canvas, member.displayName);
    ctx.strokeText(member.displayName, canvas.width / 2.5, canvas.height / 1.5);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.5);
    // Avatar image
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.closePath();
    ctx.clip();
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ dynamic: true, format: 'png' }));
    ctx.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
    defaultChannel.send(greetings.replace('{{user}}', `<${member}>`), attachment);

    // Checks if the user exists and if it doesn't adds it
    const userExists = await bot.database.User.findOne({ where: { discordID: member.id } });

    if (!userExists) {
      bot.database.User.create({
        discordID: member.id,
        birthday: null,
      })
        .then((user) => {
          bot.logger.db(`${user.discordID} ha sido añadido a la base de datos`);
        })
        .catch((err) => bot.logger.error(err));
    }
  },
};
