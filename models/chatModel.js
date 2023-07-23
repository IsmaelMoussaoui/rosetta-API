const { Sequelize, DataTypes } = require('sequelize');
const User = require('./userModel');


const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
});

const ChatModel = sequelize.define('Chat', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        },
    },
    profileId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    isAI: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});



module.exports = ChatModel;
