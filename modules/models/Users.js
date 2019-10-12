'use strict';

const Mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const DiscordUsersSchema = Mongoose.Schema({
	discordId: {
		type: String,
		unique: true,
		index: true,
	},
	tokens: {
		type: Number,
		default: 0,
		min: 0,
	},
	blacklisted: {
		type: Boolean,
		default: false,
	},
	warns: {
		type: [String],
	},
});

DiscordUsersSchema.set('autoIndex', false);
DiscordUsersSchema.plugin(uniqueValidator);

const Users = Mongoose.model('Users', DiscordUsersSchema);

Users.prototype.isBlacklisted = function() {
	return this.blacklisted;
};

/**
 * Guarda un usuario en la base de datos
 * @param {Discord} bot
 * @param {String} discordId - la ID única del usuario
 */
Users.methods.addUser = function(bot, discordId) {
	const addNewUser = new Users({
		discordId,
	});

	addNewUser.save(err => {
		if (err) {
			return bot.LogIt.error(`No se ha podido añadir el usuario ${discordId}`);
		}

		return bot.LogIt.log(`Se ha añadido el usuario ${discordId}`);
	});
};

/**
 * Comprueba si un usuario está dentro de la blacklist
 * @param {Discord} bot
 * @param {String} discordId - La ID única del usuario
 */
Users.methods.isBlacklisted = function(bot, discordId) {
	this.findOne({ discordId: discordId }, (err, res) => {
		if (err) {
			return bot.LogIt.error(
				`Ha habido un error al intentar comprobar si el usuario estaba en la lista negra: ${err}`
			);
		}

		if (!res) {
			return bot.LogIt.error('No se ha encontrado al usuario');
		}

		return res.isBlacklisted();
	});
};

/**
 * Añade o elimina tokens del un usuario
 * @param {Discord} bot
 * @param {String} discordId - La ID única del usuario
 * @param {Number} quantTokens - La cantidad de tokens
 */
Users.methods.modTokens = function(bot, discordId, quantTokens) {
	this.findOneAndUpdate({ discordId: discordId }, { $inc: { tokens: quantTokens } }, err => {
		if (err) return bot.LogIt.err(err);

		bot.LogIt.cmd(`Se han actualizado los tokens de ${discordId}`);
	});
};

/**
 * Muestra el top 3 de usuarios con mas tokens
 * @returns {Promise} query - Devuelve un JSON con los usuarios con mas tokens
 */
Users.methods.toptokens = function() {
	const query = this.find({})
		.sort({ tokens: -1 })
		.limit(3)
		.exec();

	return query;
};

module.exports = Users;
