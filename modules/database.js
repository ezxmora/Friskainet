"use strict"

const mongoose = require("mongoose")
const config = require("../config.json")
const uniqueValidator = require("mongoose-unique-validator")

mongoose.connect(config.database, { useNewUrlParser: true })

// Formula XP  round(4*(level^3)) /5)

const DiscordUsersSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	idUser: {
		type: String,
		unique: true,
		index: true
	},
	username: {
		type: String,
		required: true
	},
	tokens: {
		type: Number,
		default: 0,
		min: 0
	},
	blacklisted: {
		type: Boolean,
		default: false
	}
})

DiscordUsersSchema.set("autoIndex", false)
DiscordUsersSchema.plugin(uniqueValidator)

const User = mongoose.model("users", DiscordUsersSchema)

User.prototype.isBlacklisted = function() {
	return this.blacklisted
}

/**
 * Guarda un usuario en la base de datos (En el caso de que no exista)
 * @param {Discord} bot
 * @param {String} idUser - La ID única del usuario
 * @param {String} username - El nombre del usuario
 */
exports.addUser = (bot, idUser, username) => {
	const addNewUser = new User({
		_id: new mongoose.Types.ObjectId(),
		idUser: idUser,
		username: username
	})

	addNewUser.save(err => {
		if (err) {
			return bot.LogIt.error(`Se ha intentado añadir al usuario ${username} pero ya existe`)
		}

		return bot.LogIt.log(`Se ha añadido al usuario ${username} sin problemas`)
	})
}

/**
 * Comprueba si un usuario está o no en blacklisteado
 * @param {Discord} bot
 * @param {String} idUser - La ID única del usuario
 */
exports.isBlacklisted = (bot, idUser) => {
	User.findOne({ idUser: idUser }, (err, res) => {
		if (err) return bot.LogIt.error(err)

		if (!res) return bot.LogIt.error("No se ha encontrado al usuario")

		return res.isBlacklisted()
	})
}

/**
 * Obtiene la información de un usuario
 * @param {String} idUser - La ID única del usuario
 */
exports.getUser = idUser => {
	const query = User.find({ idUser: idUser }).exec()

	return query
}

/**
 * Actualiza el nombre del usuario según su id
 * @param {Discord} bot
 * @param {String} idUser - La ID única del usuario
 * @param {String} newName - El nuevo nombrel del usuario
 */
exports.updateUser = (bot, idUser, newName) => {
	User.findOneAndUpdate({ idUser: idUser }, { $set: { username: newName } }, err => {
		if (err) return console.log(err)

		bot.LogIt.log(`La información de ${newName} ha sido actualizada`)
	})
}

/**
 * Añade o elimina tokens de un usuario
 * @param {Discord} bot
 * @param {String} idUser - La ID única del usuario
 * @param {Number} quantTokens - La cantidad de tokens
 */
exports.modTokens = (bot, idUser, quantTokens) => {
	User.findOneAndUpdate({ idUser: idUser }, { $inc: { tokens: quantTokens } }, err => {
		if (err) return bot.LogIt.error(err)
	})
}

/**
 * Muestra el top 3 de usuarios con mas tokens
 * @returns {Promise} query - Devuelve un JSON con los usuarios con mas tokens
 */
exports.toptokens = () => {
	const query = User.find({})
		.sort({ tokens: -1 })
		.limit(3)
		.exec()

	return query
}
