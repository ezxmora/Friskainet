const { Structures } = require('discord.js');
const { User, Warn } = require('../libs/database/index');

module.exports = Structures.extend('GuildMember', (GuildMember) => class extends GuildMember {
  get info() {
    return User.findOne({ where: { discordID: this.user.id } });
  }

  get warns() {
    return this.info.then((user) => Warn.findAll({ where: { userId: user.userId } }));
  }

  giveTokens(amount) {
    return this.info
      .then((user) => {
        user.increment('balance', { by: amount });
      });
  }

  takeTokens(amount) {
    return this.info
      .then((user) => {
        user.decrement('balance', { by: amount });
      });
  }
});
