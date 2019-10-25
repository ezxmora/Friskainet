const { Util } = require('discord.js');
const ytdl = require('ytdl-core');
const ytdlDiscord = require('ytdl-core-discord');
const ytsearch = require('youtube-search');

exports.run = async (bot, message, args) => {
	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel) return message.channel.send('Necesitas estar en un canal de voz para poner música');
	const perms = voiceChannel.permissionsFor(message.client.user);
	if (!perms.has('CONNECT')) return message.channel.send('No me puedo conectar mano');
	if (!perms.has('SPEAK')) return message.channel.send('No puedo hablar mano');

	const options = {
		maxResults: 5,
		key: bot.config.googleToken,
	};

	let url;
	if (!bot.util.validYoutube(args.join(' '))) {
		ytsearch(args.join(' '), options, function(err, results) {
			if (err) return console.log(err);

			let percentageComparison = 0;
			let indexComparison;

			for (let i = 0; i < results.length; i++) {
				if (results[i].kind == 'youtube#channel') {
					continue;
				} else {
					const comparison = bot.util.compareTwoStrings(results[i].title, args.join(' '));
					if (comparison > percentageComparison) {
						percentageComparison = comparison;
						indexComparison = i;
						url = results[indexComparison].link;
					}
				}
			}
		});
	} else {
		url = args[0];
	}

	const serverQueue = bot.queue.get(message.guild.id);
	const songInfo = await ytdl.getInfo(url);
	const song = {
		id: songInfo.video_id,
		title: Util.escapeMarkdown(songInfo.title),
		url: songInfo.video_url,
	};

	// If the server has a queue created, adds the song
	if (serverQueue) {
		serverQueue.songs.push(song);
		return message.channel.send(`**${song.title}** se ha añadido a la cola`);
	}

	const queueConstructor = {
		textChannel: message.channel,
		voiceChannel,
		connection: null,
		songs: [],
		volume: 2,
		playing: true,
	};

	bot.queue.set(message.guild.id, queueConstructor);
	queueConstructor.songs.push(song);

	const play = async (song) => {
		const queue = bot.queue.get(message.guild.id);

		if (!song) {
			queue.voiceChannel.leave();
			bot.queue.delete(message.guild.id);
			return;
		}

		// The bit shifting in the highWaterMark is needed to add buffer for the song so it doesn't cut.
		const dispatcher = queue.connection.play(await ytdlDiscord(song.url), { type: 'opus', passes: 5, highWaterMark: 1 << 13 })
			.on('end', (reason) => {
				if (reason === 'Stream is not generating quickly enough.') {
					bot.LogIt.error('La canción ha terminado antes de lo previsto');
				}
				queue.songs.shift();
				play(queue.songs[0]);
			})
			.on('error', error => console.log('Error:', error));
		dispatcher.setVolumeLogarithmic(queue.volume / 5);
		message.channel.send(`Playing: **${song.title}**`);
	};

	try {
		const connection = await voiceChannel.join();
		queueConstructor.connection = connection;
		play(queueConstructor.songs[0]);

	} catch (error) {
		bot.LogIt.error('No me he podido unir al canal de voz');
		console.log('Error:', error);
		bot.queue.delete(message.guild.id);
		voiceChannel.leave();
		return message.channel.send('Ha habido un error al intentar unirme.');
	}
};

exports.help = async (bot, message) => {
	const embed = {
		color: ((1 << 24) * Math.random()) | 0,
		title: bot.lang.C_USAGE_TITLE,
		description: bot.lang.C_USAGE.PLAY.replace('{{syntax}}', `${bot.config.prefix}play`),
	};

	message.channel.send({ embed });
};