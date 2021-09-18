module.exports = (sequelize, DataTypes) => sequelize.define('pokemonromuser', {
  // 0: 'playing',
  // 1: 'finished',
  // 2: 'lost or retired',
  playing: {
    type: DataTypes.INTEGER,
    defaultValue: false,
    allowNull: false,
  },
  romURL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // URL with the team that is going to be used in the tournament phase
  team: {
    type: DataTypes.STRING,
  },
  winner: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: false,
});
