module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        discordID: {
            type: DataTypes.STRING,
            primaryKey: true,
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
            type: DataTypes.DATEONLY
        }
    }, {
        timestamps: true
    });
};