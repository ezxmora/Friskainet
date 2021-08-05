module.exports = (sequelize, DataTypes) => sequelize.define('User', {
  userId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  balance: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 100,
    allowNull: false,
  },
  experience: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    allowNull: false,
  },
  level: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 1,
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
  timestamps: false,
});
