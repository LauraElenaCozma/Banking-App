'use strict';
const models = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let usersQuery = await models.User.findAll();
    //Initially every user has the `Origin` promotion
    let userPromotions = usersQuery.map(user => ({
     userId: user.id,
     promotionId: 1,
     createdAt: new Date(),
     updatedAt: new Date(),
   }));

   userPromotions.push({
    userId: 3,
    promotionId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
   });

   userPromotions.push({
    userId: 1,
    promotionId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
   });

   userPromotions.push({
    userId: 4,
    promotionId: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
   });

   userPromotions.push({
    userId: 3,
    promotionId: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
   });

   userPromotions.push({
    userId: 2,
    promotionId: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
   });

   await queryInterface.bulkInsert('UserPromotions', userPromotions, {});
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('UserPromotions', null, {});
  }
};
