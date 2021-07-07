module.exports = (sequelize, DataTypes) => sequelize.define('User', {
  userId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
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
