const { Sequelize, DataTypes } = require('sequelize');
const { database } = require('../../resources/config');
const logger = require('../logger');

const sequelize = new Sequelize(database.databaseName, database.username, database.password, {
  host: database.host,
  dialect: database.dialect,
  logging: false,
});

const User = require('./models/User')(sequelize, DataTypes);
const Rule = require('./models/Rule')(sequelize, DataTypes);
const Warn = require('./models/Warn')(sequelize, DataTypes);

// Relations
User.hasMany(Warn, { foreignKey: 'userId' });
Warn.belongsTo(User, { foreignKey: 'userId' });

// Methods
User.prototype.isBlacklisted = () => this.blacklisted;

// Drops all the tables and creates them again.
const syncAll = (callback) => {
  sequelize.sync({ force: true })
    .then(() => {
      logger.db('Se ha reseteado la base de datos');

      if (typeof callback === 'function') callback();
    })
    .catch((err) => logger.error(err));
};

module.exports = {
  User,
  Rule,
  Warn,
  syncAll,
  sequelize,
};
