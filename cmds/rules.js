exports.run = async (bot, message, args) => {
	const action = args[0];

	switch (action) {
	case 'add':
		await console.log('add');
		break;

	case 'update':
		await console.log('update');
		break;

	case 'remove':
		await console.log('remove');
		break;

	default:
		await console.log('default');
		break;
	}
};

exports.help = async (bot, message) => {
	const embed = {
		color: ((1 << 24) * Math.random()) | 0,
		title: 'Uso del comando',
		description: 'Yo que se mano\n_<Test>_',
	};

	message.channel.send({ embed });
};
