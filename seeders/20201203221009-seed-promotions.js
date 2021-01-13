'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Promotions', [{
         name: 'Origin',
         price: 0,
         startDate: null,
         endDate: null,
         maxNoOfAccounts: 1,
         maxTransaction: 1000,
         createdAt: new Date(),
         updatedAt: new Date(),
       },
       {
        name: 'Premium Accounts',
        price: 250,
        startDate: null,
        endDate: null,
        maxNoOfAccounts: 3,
        maxTransaction: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Gold Accounts',
        price: 500,
        startDate: null,
        endDate: null,
        maxNoOfAccounts: 6,
        maxTransaction: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Big transactions',
        price: 100,
        startDate: '2021-1-1',
        endDate: '2023-12-31',
        maxNoOfAccounts: null,
        maxTransaction: 10000,
        createdAt: new Date(),
        updatedAt: new Date(),
      }], {});
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Promotions', null, {});
  }
};
