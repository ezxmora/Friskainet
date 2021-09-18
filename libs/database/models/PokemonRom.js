module.exports = (sequelize, DataTypes) => sequelize.define('pokemonrom', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currentROMPath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currentSettingsPath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currentlyRunning: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: false,
});
