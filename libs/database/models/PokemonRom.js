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
  // 0: 'not started',
  // 1: 'playing or running phase',
  // 2: 'tournament phase',
  // 3: 'finished'
  tournamentPhase: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  channelId: {
    type: DataTypes.STRING,
  },
  challongeTournamentId: {
    type: DataTypes.STRING,
  },
  tournamentName: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: false,
});
