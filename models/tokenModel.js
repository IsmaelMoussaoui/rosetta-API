const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: console.log  // add this line
});

const RefreshToken = sequelize.define('RefreshToken', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users', // 'users' refers to table name
            key: 'id', // 'id' refers to column name in users table
        }
    }
}, {
    // Other model options go here
    timestamps: true,
});

module.exports = RefreshToken;
