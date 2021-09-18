const { Sequelize, DataTypes } = require('sequelize');
const { databaseURL } = require('../../resources/config');
const logger = require('../logger');

const sequelize = new Sequelize(databaseURL, {
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const User = require('./models/User')(sequelize, DataTypes);
const Rule = require('./models/Rule')(sequelize, DataTypes);
const Warn = require('./models/Warn')(sequelize, DataTypes);
const PokemonRom = require('./models/PokemonRom')(sequelize, DataTypes);
const PokemonRomUser = require('./models/PokemonRomUser')(sequelize, DataTypes);

// Relations
User.hasMany(Warn, { foreignKey: 'userId' });
Warn.belongsTo(User, { foreignKey: 'userId' });
User.belongsToMany(PokemonRom, { as: 'pokemonRom', foreignKey: 'userId', through: PokemonRomUser });
PokemonRom.belongsTo(User, { as: 'user', foreignKey: 'pokemonRomId', through: PokemonRomUser });

// Methods
User.prototype.isBlacklisted = () => this.blacklisted;

// Drops all the tables and creates them again.
const syncAll = (callback) => {
  sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
    .then(() => sequelize.sync({ force: true }))
    .then(() => sequelize.query('SET FOREIGN_KEY_CHECKS = 1'))
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
  PokemonRom,
  PokemonRomUser,
  syncAll,
  sequelize,
};
