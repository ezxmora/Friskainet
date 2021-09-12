module.exports = (sequelize, DataTypes) => sequelize.define('pokemonromuser', {
  // 0: 'playing',
  // 1: 'finished',
  // 2: 'lost',
  playing: {
    type: DataTypes.INTEGER,
    defaultValue: false,
  },
}, {
  timestamps: false,
});
