exports.run = async (bot, message, [, ...reason]) => {
	const modRole = message.guild.roles.find(role => role.name === bot.config.roleAdmin);
	if (!modRole) return bot.LogIt.warn(bot.lang.ROLE_DOESNT_EXIST);

	if (!message.member.roles.has(modRole.id)) {
		exports.help(bot, message);
		return message.reply(bot.lang.NOT_ALLOWED);
	}

	if (message.mentions.members.size === 0) {
		exports.help(bot, message);
		return message.reply(bot.lang.NEED_MENTION);
	}

	if (!message.guild.me.hasPermission('KICK_MEMBERS')) return message.reply('');

	const kickMember = message.mentions.members.first();

	await kickMember.kick(reason.join(' '))
		.then(member => {
			bot.LogIt.log(bot.lang.SYS.KICK.replace('{{user}}', member.user.username));
			message.reply(bot.lang.SYS.KICK.replace('{{user}}', member.user.username));
		})
		.catch((err) => {
			bot.LogIt.error(bot.lang.SYS.ERROR.replace('{{error}}', err));
		});
};

exports.help = async (bot, message) => {
	const embed = {
		color: ((1 << 24) * Math.random()) | 0,
		title: bot.lang.C_USAGE_TITLE,
		description: bot.lang.C_USAGE.KICK.replace('{{syntax}}', `${bot.config.prefix}kick`),
	};

	message.channel.send({ embed });
};