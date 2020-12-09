'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transactions = [];

    transactions.push({
      id_account_from: 3,
      id_account_to: 1,
      sum: 2000,
      date: '2021-3-3',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    transactions.push({
      id_account_from: 8,
      id_account_to: 1,
      sum: 7999,
      date: '2021-1-2',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    transactions.push({
      id_account_from: 4,
      id_account_to: 2,
      sum: 450,
      date: '2020-10-10',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    transactions.push({
      id_account_from: 5,
      id_account_to: 7,
      sum: 600,
      date: '2020-12-12',
      createdAt: new Date(),
      updatedAt: new Date(),
    });


    await queryInterface.bulkInsert('Transactions', transactions, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Transactions', null, {});
  }
};
