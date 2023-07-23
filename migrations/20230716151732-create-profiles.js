'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY
      },
      sex: {
        type: Sequelize.ENUM('male', 'female')
      },
      age: {
        type: Sequelize.INTEGER
      },
      height: {
        type: Sequelize.FLOAT
      },
      weight: {
        type: Sequelize.FLOAT
      },
      smoke: {
        type: Sequelize.BOOLEAN
      },
      alcohol: {
        type: Sequelize.BOOLEAN
      },
      drugs: {
        type: Sequelize.BOOLEAN
      },
      physicalActivity: {
        type: Sequelize.ENUM('sedentary', 'light', 'moderate', 'intense')
      },
      other: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Profiles');
  }
};
