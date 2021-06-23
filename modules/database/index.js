const { Sequelize, DataTypes } = require('sequelize');
const { database } = require('../../resources/config');

const sequelize = new Sequelize(database.databaseName, database.username, database.password, {
    host: database.host,
    dialect: database.dialect,
    logging: false,
});

const User = require('./User')(sequelize, DataTypes);
const Rule = require('./Rule')(sequelize, DataTypes);

User.prototype.isBlacklisted = function () {
    return this.blacklisted;
}

module.exports = { User, Rule };