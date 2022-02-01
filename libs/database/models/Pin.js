module.exports = (sequelize, DataTypes) => sequelize.define('pin', {
  pinId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  messageId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pinned: {
    type: DataTypes.BOOLEAN,
  },
}, {
  timestamps: false,
});
