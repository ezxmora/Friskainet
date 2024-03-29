const { Sequelize, DataTypes } = require('sequelize');
const { databaseURL } = require('@config');
const Logger = require('@bot/Logger');

const logger = new Logger();

const sequelize = new Sequelize(databaseURL, {
  logging: false,
});

const User = require('./models/User')(sequelize, DataTypes);
const Rule = require('./models/Rule')(sequelize, DataTypes);
const Warn = require('./models/Warn')(sequelize, DataTypes);
const Pin = require('./models/Pin')(sequelize, DataTypes);
const Command = require('./models/Command')(sequelize, DataTypes);
const Stat = require('./models/Stat')(sequelize, DataTypes);

// Relations
User.hasMany(Warn, { foreignKey: 'userId' });
Warn.belongsTo(User, { foreignKey: 'userId' });

// Methods
User.prototype.isBlacklisted = () => this.blacklisted;

// Drops all the tables and creates them again.
const syncAll = (callback) => {
  sequelize.sync({ alter: true })
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
  Pin,
  Command,
  Stat,
  syncAll,
  sequelize,
};
