const Canvas = require('canvas');

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	let fontSize = 70;

	do {
		ctx.font = `${(fontSize -= 10)}px sans-serif`;
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
};

module.exports = async (bot, member) => {
	const defaultChannel = member.guild.channels.find(channel => channel.name === bot.config.entryChannel);

	const greetings = bot.config.greetings[Math.floor(Math.random() * bot.config.greetings.length)];

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');
	const background = await Canvas.loadImage('./resources/img/bg.png');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.font = '28px sans-serif';
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 5;
	ctx.strokeText(bot.lang.WELCOME, canvas.width / 2.5, canvas.height / 2.5);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(bot.lang.WELCOME, canvas.width / 2.5, canvas.height / 2.5);

	ctx.font = applyText(canvas, `${member.displayName}`);
	ctx.strokeText(`${member.displayName}`, canvas.width / 2.5, canvas.height / 1.5);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${member.displayName}`, canvas.width / 2.5, canvas.height / 1.5);


	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.lineWidth = 5;
	ctx.strokeStyle = 'white';
	ctx.stroke();
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new bot.Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

	defaultChannel.send(greetings.replace('{{user}}', `${member}`), attachment);
	bot.LogIt.log(`${member.user.tag} ${bot.lang.S_WELCOME}`);
	// bot.db.addUser(bot, member.user.id, member.user.tag);
};
