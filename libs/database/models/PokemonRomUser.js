module.exports = (sequelize, DataTypes) => sequelize.define('pokemonromuser', {
  // 0: 'playing',
  // 1: 'finished',
  // 2: 'lost',
  playing: {
    type: DataTypes.INTEGER,
    defaultValue: false,
    allowNull: false,
  },
  romURL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});
