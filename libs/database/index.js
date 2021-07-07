const { Sequelize, DataTypes, Op } = require('sequelize');
const { database } = require('../../resources/config');

const sequelize = new Sequelize(database.databaseName, database.username, database.password, {
  host: database.host,
  dialect: database.dialect,
  logging: false,
});

const User = require('./models/User')(sequelize, DataTypes);
const Rule = require('./models/Rule')(sequelize, DataTypes);
const Experience = require('./models/Experience')(sequelize, DataTypes);
const Warn = require('./models/Warn')(sequelize, DataTypes);

// Relations
User.hasOne(Experience, { foreignKey: 'userId' });
User.hasMany(Warn, { foreignKey: 'userId' });

// Methods
User.prototype.isBlacklisted = () => this.blacklisted;

// Drops all the tables and creates them again.
const syncAll = () => {
  sequelize.sync({ force: true, alter: true });
};

module.exports = {
  User, Rule, Experience, Warn, syncAll, Op,
};

//  DROP DATABASE friskainet; CREATE DATABASE friskainet; USE friskainet;
