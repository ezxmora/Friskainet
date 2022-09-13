module.exports = (sequelize, DataTypes) => sequelize.define('stat', {
  server: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  messages: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    min: 0,
  },
  links: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    min: 0,
  },
  mentions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    min: 0,
  },
  commands: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    min: 0,
  },
  onlineUsers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    min: 0,
  },
  totalUsers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    min: 0,
  },
}, {
  timestamps: false,
});
