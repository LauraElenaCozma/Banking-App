'use strict';
const faker = require('faker');
const config = require('../config/configSecretKey.js');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const mockUsers = new Array(4).fill().map(() => {
      
      // for each created user, the password will be its firstname encrypted so as to access them easier
      const firstName = faker.name.firstName();
      console.log(firstName)
      const hashedPassword =  bcrypt.hashSync(firstName, config.SALT_ROUND);

      return {
        firstName: firstName,
        lastName: faker.name.lastName(),
        phone: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    await queryInterface.bulkInsert('Users', mockUsers, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
