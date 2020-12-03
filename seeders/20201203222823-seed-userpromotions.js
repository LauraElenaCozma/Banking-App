'use strict';
const models = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersQuery = await models.User.findAll();
    //Initially every user has the `Origin` promotion
    const userPromotions = usersQuery.map(user => ({
     userId: user.id,
     promotionId: 1,
     createdAt: new Date(),
     updatedAt: new Date(),
   }));
   await queryInterface.bulkInsert('UserPromotions', userPromotions, {});
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
