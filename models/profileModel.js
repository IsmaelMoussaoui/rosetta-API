const { Sequelize, DataTypes } = require('sequelize');
const User = require('./userModel');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
});

const Profile = sequelize.define('Profile', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    // Here define the rest of the profile model schema
    firstName: { type: DataTypes.STRING, allowNull: true },
    lastName: { type: DataTypes.STRING, allowNull: true },
    dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
    sex: { type: DataTypes.ENUM, values: ['male', 'female'], allowNull: true },
    age: { type: DataTypes.INTEGER, allowNull: true },
    height: { type: DataTypes.FLOAT, allowNull: true },
    weight: { type: DataTypes.FLOAT, allowNull: true },
    smoke: { type: DataTypes.BOOLEAN, allowNull: true },
    alcohol: { type: DataTypes.BOOLEAN, allowNull: true },
    drugs: { type: DataTypes.BOOLEAN, allowNull: true },
    physicalActivity: { type: DataTypes.ENUM, values: ['sedentary', 'light', 'moderate', 'intense'], allowNull: true },
    other: { type: DataTypes.TEXT, allowNull: true },
});

module.exports = Profile;
