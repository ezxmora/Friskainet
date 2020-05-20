'use strict';

const Mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const RulesScheme = Mongoose.Schema({
	title: {
		type: String,
		unique: true,
		index: true,
	},
	content: {
		type: String,
		required: true,
	},
	created: {
		type: Date,
		default: Date.now(),
	},
});

/**
 * Shows all the rules
 * @param {requestCallback} cb - The callback that handles the response
 */
RulesScheme.statics.getRules = function getRules(cb) {
	return this.find().exec(cb);
};

/**
 * Adds a rule to the server - DISABLED
 * @param {Discord} bot
 * @param {String} title - Title of the rule
 * @param {Content} content - Content of the rule

RulesScheme.methods.addRule = function(bot, title, content) {
	const rule = new Rules({
		title,
		content,
	});

	rule.save(err => {
		if (err) {
			return bot.LogIt.error('There has been an error adding the rule');
		}

		return bot.LogIt.log('The rule has been added');
	});
}; */

/**
 * Removes a rule by the title - DISABLED
 * @param {Discord} bot
 * @param {String} title - Title of the rule

RulesScheme.methods.removeRule = function(bot, title) {
	this.deleteOne({ title: `/${title}/i` }, function(err) {
		if (err) {
			return bot.LogIt.error('There has been an error removing the rule');
		}

		return bot.LogIt.log('The rule has been removed');
	});
}; */

RulesScheme.set('autoIndex', false);
RulesScheme.plugin(uniqueValidator);

const Rules = Mongoose.model('rules', RulesScheme);
module.exports = Rules;
