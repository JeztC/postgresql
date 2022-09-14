const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        author: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        likes: {
            type: DataTypes.INTEGER,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                customValidator(value) {
                    if (value < 1991 || value > 2022) {
                        throw new Error(`${value} is less than 1991 or greater than 2022`);
                    }
                }
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', key: 'id' },
        },
    },
    {
        sequelize,
        underscored: true,
        timestamps: false,
        modelName: 'blog'
    })

module.exports = Blog