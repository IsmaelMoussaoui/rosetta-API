'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'sex', { type: Sequelize.ENUM, values: ['male', 'female'], allowNull: true });
    await queryInterface.addColumn('Users', 'age', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('Users', 'smoke', { type: Sequelize.BOOLEAN, allowNull: true });
    await queryInterface.addColumn('Users', 'alcohol', { type: Sequelize.BOOLEAN, allowNull: true });
    await queryInterface.addColumn('Users', 'drugs', { type: Sequelize.BOOLEAN, allowNull: true });
    await queryInterface.addColumn('Users', 'physicalActivity', { type: Sequelize.ENUM, values: ['sedentary', 'light', 'moderate', 'intense'], allowNull: true });
    await queryInterface.addColumn('Users', 'other', { type: Sequelize.TEXT, allowNull: true });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'sex');
    await queryInterface.removeColumn('Users', 'age');
    await queryInterface.removeColumn('Users', 'smoke');
    await queryInterface.removeColumn('Users', 'alcohol');
    await queryInterface.removeColumn('Users', 'drugs');
    await queryInterface.removeColumn('Users', 'physicalActivity');
    await queryInterface.removeColumn('Users', 'other');
  }
};
