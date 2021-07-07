module.exports = (sequelize, DataTypes) => sequelize.define('Rule', {
  ruleId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(35),
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING(400),
    allowNull: false,
  },
}, {
  timestamps: true,
});
