exports.run = async (bot, message) => {
	// Comprobamos que tenga permisos para borrar mensajes
	if (message.member.hasPermission('MANAGE_MESSAGES')) {
		// Recogemos todos los mentajes y los borramos
		await message.channel
			.fetchMessages()
			.then(msg => {
				const notPinned = msg.filter(m => !m.pinned);

				message.channel
					.bulkDelete(notPinned, true)
					.then(() => bot.LogIt.log(`Se han borrado ${notPinned.size} mensajes`))
					.catch(console.error);
			})
			.catch(err => {
				console.log(err);
			});
	}
};
