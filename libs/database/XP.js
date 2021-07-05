module.exports = (sequelize, DataTypes) => sequelize.define('XP', {
  currentXP: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  currentLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: false,
});
