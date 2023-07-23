'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Chats', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Users', // name of your table
        key: 'id',
      },
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Chats', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false, // previously this was true
      references: {
        model: 'Users',
        key: 'id',
      },
    });
  }
};
