module.exports = (sequelize, DataTypes) => sequelize.define('Rule', {
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
