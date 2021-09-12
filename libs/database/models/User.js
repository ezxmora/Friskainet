module.exports = (sequelize, DataTypes) => sequelize.define('user', {
  userId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  balance: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    allowNull: false,
    min: 0,
  },
  experience: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    min: 0,
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
    min: 0,
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
