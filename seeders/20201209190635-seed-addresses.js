'use strict';
const models = require('../models');
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersQuery = await models.User.findAll();
    let addresses = [];
    
    addresses.push({
      userId: 1,
      street: "Cuza Voda",
      no: 8,
      city: "Roman",
      country: "Romania",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    addresses.push({
      userId: 2,
      street: "Splaiul Independentei",
      no: 204,
      city: "Bucuresti",
      country: "Romania",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    addresses.push({
      userId: 3,
      street: "Regina Elisabeta",
      no: 87,
      city: "Timisoara",
      country: "Romania",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    addresses.push({
      userId: 4,
      street: "Dianei",
      no: 4,
      city: "Bucuresti",
      country: "Romania",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await queryInterface.bulkInsert('Addresses', addresses, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Addresses', null, {});
  }
};
