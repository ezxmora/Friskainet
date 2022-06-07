const { Sequelize, DataTypes } = require('sequelize');
const { databaseURL, debug } = require('@config');
const Logger = require('@bot/Logger');

const logger = new Logger();
let sequelize;

if (debug) {
  sequelize = new Sequelize(databaseURL, {
    logging: false,
  });
}
else {
  sequelize = new Sequelize(databaseURL, {
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
}

const User = require('./models/User')(sequelize, DataTypes);
const Rule = require('./models/Rule')(sequelize, DataTypes);
const Warn = require('./models/Warn')(sequelize, DataTypes);
const Pin = require('./models/Pin')(sequelize, DataTypes);
const PokemonRom = require('./models/PokemonRom')(sequelize, DataTypes);
const Command = require('./models/Command')(sequelize, DataTypes);
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
  PokemonRom,
  Pin,
  Command,
  PokemonRomUser,
  syncAll,
  sequelize,
};
