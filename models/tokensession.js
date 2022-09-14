const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class TokenSession extends Model {}

TokenSession.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
    },
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'tokensessions'
})

module.exports = TokenSession