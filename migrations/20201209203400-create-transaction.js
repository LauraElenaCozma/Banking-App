'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      iban_from: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'Accounts',
          },
          key: 'iban'
        },
      },
      iban_to: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      sum: {
        type: Sequelize.FLOAT
      },
      date: {
        type: Sequelize.DATEONLY
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
    await queryInterface.dropTable('Transactions');
  }
};