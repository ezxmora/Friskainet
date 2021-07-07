module.exports = (sequelize, DataTypes) => sequelize.define('Warn', {
  warnId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING(400),
  },
}, {
  timestamps: true,
});
