/**
 * Distributes randomly the elements of an array.
 * @param {Array} array - They array that we are shuffling.
 * @returns String[]
 */
const shuffleArray = (array) => {
	let currentIndex = array.length,
		temporaryValue,
		randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
};

/**
 * Chunks the array.
 * @param {Array} array - They array that we are going to chunk.
 * @param {Integer} groups - Number of groups that we are going to create.
 * @returns {Array}
 */
const chunkArray = (array, size) => {
	const results = [];

	while (array.length) {
		results.push(array.splice(0, size));
	}
	return results;
};

/**
 * Creates a table from an array.
 * @param {Array} array - The array that we are going to use.
 * @returns {String}
 */
const createTable = (bot, array) => {
	let table = '';
	for (let i = 0; i < array.length; i++) {
		table += bot.lang.C_MSG.SHUFFLE_TABLE.replace('{{num}}', i + 1);
		for (let k = 0; k < array[i].length; k++) {
			table += `${array[i][k]} `;
		}
		table += '\n';
	}

	return table;
};

exports.run = async (bot, message, args) => {
	const numGroups = args[0];
	if (isNaN(numGroups)) return message.reply(bot.lang.C_MSG.SHUFFLE_ISNAN);

	const intGroups = parseInt(numGroups);
	const usersArray = [];
	for (let i = 1; i < args.length; i++) {
		usersArray.push(args[i]);
	}

	if (intGroups > usersArray.length) {
		return message.reply(bot.lang.C_MSG.SHUFFLE_GROUPS);
	}

	const finalArray = createTable(bot, chunkArray(shuffleArray(usersArray), intGroups));

	await message.channel.send(finalArray);
	bot.LogIt.cmd(bot.lang.C_MSG.SHUFFLE_USED.replace('{{user}}', message.author.tag));
};

exports.help = async (bot, message) => {
	const embed = {
		color: ((1 << 24) * Math.random()) | 0,
		title: bot.lang.C_USAGE_TITLE,
		description: bot.lang.C_USAGE.SHUFFLE.replace('{{syntax}}', `${bot.config.prefix}shuffle`),
	};

	message.channel.send({ embed });
};