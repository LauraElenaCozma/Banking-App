'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Promotion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Promotion.belongsToMany(models.User, { through: 'UserPromotions' });
    }
  };
  Promotion.init({
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    maxNoOfAccounts: DataTypes.INTEGER,
    maxSumOfTransactions: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Promotion',
  });
  return Promotion;
};