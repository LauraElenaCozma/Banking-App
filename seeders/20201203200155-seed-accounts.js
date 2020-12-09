'use strict';
const models = require('../models');
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersQuery = await models.User.findAll();
    let usersAccounts = usersQuery.map(user => ({
      userId: user.id,
      iban: faker.finance.iban(),
      balance: Math.floor(Math.random() * 10000),
      blocked: faker.random.boolean(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    usersAccounts.push({
      userId: 4,
      iban: faker.finance.iban(),
      balance: Math.floor(Math.random() * 10000),
      blocked: faker.random.boolean(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersAccounts.push({
      userId: 4,
      iban: faker.finance.iban(),
      balance: Math.floor(Math.random() * 10000),
      blocked: faker.random.boolean(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersAccounts.push({
      userId: 4,
      iban: faker.finance.iban(),
      balance: Math.floor(Math.random() * 10000),
      blocked: faker.random.boolean(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersAccounts.push({
      userId: 3,
      iban: faker.finance.iban(),
      balance: Math.floor(Math.random() * 10000),
      blocked: faker.random.boolean(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await queryInterface.bulkInsert('Accounts', usersAccounts, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Accounts', null, {});
  }
};
