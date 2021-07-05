const { Sequelize, DataTypes, Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { database } = require('../../resources/config');

const sequelize = new Sequelize(database.databaseName, database.username, database.password, {
  host: database.host,
  dialect: database.dialect,
  logging: false,
});

const User = require('./User')(sequelize, DataTypes);
const Rule = require('./Rule')(sequelize, DataTypes);
const XP = require('./XP')(sequelize, DataTypes);

User.hasOne(XP);
XP.belongsTo(User);

User.prototype.isBlacklisted = () => this.blacklisted;

User.beforeCreate((user) => user.id = uuidv4());

/**
 * Drops all the tables and creates it again.
 */
const syncAll = () => {
  sequelize.sync({ force: false, alter: true });
};

module.exports = {
  User, Rule, XP, syncAll, Op,
};
