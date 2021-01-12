'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Account.hasMany(models.Transaction, { foreignKey: 'iban_from', targetKey: 'iban'} );
      models.Account.belongsTo(models.User, { foreignKey: 'userId' });
    }
  };
  Account.init({
    iban: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    balance: DataTypes.DOUBLE,
    blocked: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};