'use strict';
const models = require('../models');
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let usersAccounts = [];

    usersAccounts.push({
      userId: 1,
      iban: "ABCDEF",
      balance: Math.floor(Math.random() * 10000),
      blocked: faker.random.boolean(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });


    usersAccounts.push({
      userId: 1,
      iban: "GHIJKL",
      balance: Math.floor(Math.random() * 10000),
      blocked: faker.random.boolean(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersAccounts.push({
      userId: 2,
      iban: 'MNOPQR',
      balance: Math.floor(Math.random() * 10000),
      blocked: faker.random.boolean(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersAccounts.push({
      userId: 3,
      iban: 'STUVWX',
      balance: Math.floor(Math.random() * 10000),
      blocked: faker.random.boolean(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    usersAccounts.push({
      userId: 3,
      iban: 'YZ1234',
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
