module.exports = (sequelize, DataTypes) => sequelize.define('command', {
  commandId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  category: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  uses: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    min: 0,
  },
}, {
  timestamps: false,
});
