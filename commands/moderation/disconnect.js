module.exports = {
	name: 'disconnect',
	description: 'Desconecta a un usuario de un canal de voz',
	category: 'moderation',
	permissions: 'MOVE_MEMBERS',
	args: true,
	usage: '<Mención al usuario> [Motivo]',
	run: async (message, args) => {
		const { LogIt } = message.client;

		if (!message.mentions.members.first()) return message.reply('Necesitas especificar un usuario');

		const member = message.mentions.members.first();

		member.voice.kick(args.slice(0).join(' '))
			.then((userKicked) => {
				LogIt.log(`${userKicked.user.tag} fue expulsado del canal de voz`);
			})
			.catch((error) => {
				LogIt.error(`Ha habido un error al expulsar el usuario:\n${error}`);
			});
	}
}