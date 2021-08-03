module.exports = (sequelize, DataTypes) => sequelize.define('Experience', {
  experienceId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  currentXP: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  currentLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  timestamps: false,
});
