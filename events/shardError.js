module.exports = async (bot, error) => {
	bot.LogIt.error(`A websocket connection encountered an error: ${error}`);
};