'use strict';
const models = require('../models');
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    const usersQuery = await models.User.findAll();
    const usersAccounts = usersQuery.map(user => ({
     userId: user.id,
     iban: faker.finance.iban(),
     balance: Math.random() * 100000000,
     blocked: faker.random.boolean(),
     createdAt: new Date(),
     updatedAt: new Date(),
   }));

   await queryInterface.bulkInsert('Accounts', usersAccounts, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
