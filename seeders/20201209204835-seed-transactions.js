'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transactions = [];

    transactions.push({
      iban_from: 'ABCDEF',
      iban_to: 'GHIJKL',
      sum: 2000,
      date: '2021-3-3',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    transactions.push({
      iban_from: 'YZ1234',
      iban_to: 'ABCDEF',
      sum: 7999,
      date: '2021-1-2',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    transactions.push({
      iban_from: 'ABCDEF',
      iban_to: 'STUVWX',
      sum: 450,
      date: '2020-10-10',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    transactions.push({
      iban_from: 'GHIJKL',
      iban_to: 'STUVWX',
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
