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
	league: {
		type: [String],
	},
	birthday: {
		type: Date,
	},
});

/**
 * Checks if a user is blacklisted
 * @returns {Boolean}
 */
DiscordUsersSchema.methods.isUserBlacklisted = function() {
	return this.blacklisted;
};

/**
 * Adds or deletes tokens from an user - DISABLED
 * @param {Discord} bot
 * @param {String} discordId - Unique ID of the user
 * @param {Number} quantTokens - Quantity of tokens

DiscordUsersSchema.methods.modTokens = function(bot, discordId, quantTokens) {
	this.findOneAndUpdate({ discordId: discordId }, { $inc: { tokens: quantTokens } }, err => {
		if (err) return bot.LogIt.err(err);

		bot.LogIt.cmd(`Se han actualizado los tokens de ${discordId}`);
	});
}; */

/**
 * Shows top 3 of richest users
 * @param {requestCallback} cb - The callback that handles the response
 */
DiscordUsersSchema.statics.toptokens = function toptokens(cb) {
	return this.find().sort({ tokens: -1 }).limit(3).exec(cb);
};

DiscordUsersSchema.set('autoIndex', false);
DiscordUsersSchema.plugin(uniqueValidator);

const Users = Mongoose.model('Users', DiscordUsersSchema);
module.exports = Users;
