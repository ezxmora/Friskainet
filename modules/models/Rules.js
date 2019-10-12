'use strict';

const { Mongoose } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const RulesScheme = Mongoose.Schema({
	_id: Mongoose.Schema.Types.ObjectId,
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
 * Adds a rule to the server
 * @param {Discord} bot
 * @param {String} title - Title of the rule
 * @param {Content} content - Content of the rule
 */
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
};

/**
 * Removes a rule by the title
 * @param {Discord} bot
 * @param {String} title - Title of the rule
 */
RulesScheme.methods.removeRule = function(bot, title) {
	this.deleteOne({ title: `/${title}/i` }, function(err) {
		if (err) {
			return bot.LogIt.error('There has been an error removing the rule');
		}

		return bot.LogIt.log('The rule has been removed');
	});
};

/**
 * Updates a rule by the title
 * @param {Discord} bot
 * @param {String} title - Title of the rule
 * @param
 */
RulesScheme.methods.updateRule = function(params) {};

RulesScheme.set('autoIndex', false);
RulesScheme.plugin(uniqueValidator);

const Rules = Mongoose.model('rules', RulesScheme);

module.exports = Rules;
