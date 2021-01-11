'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Transaction.belongsTo(models.Account, {
        foreignKey: 'id_account_from'
      });

      models.Transaction.belongsTo(models.Account, {
        foreignKey: 'id_account_to'
      });
    }
  };
  Transaction.init({
    sum: DataTypes.FLOAT,
    date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};