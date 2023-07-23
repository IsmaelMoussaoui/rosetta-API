'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'dateOfBirth');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'dateOfBirth', { type: Sequelize.DATE, allowNull: true });
  }
};
