module.exports = (sequelize, DataTypes) => sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  discordID: {
    type: DataTypes.STRING,
    unique: true,
  },
  balance: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    allowNull: false,
  },
  blacklisted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  birthday: {
    type: DataTypes.DATEONLY,
  },
}, {
  timestamps: true,
});
