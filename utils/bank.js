const config = require('../config/configSecretKey.js');
const bcrypt = require('bcrypt');

const userBank = {
    firstName: 'Bank',
    lastName: 'Bank',
    phone: '0000000000',
    email: 'bank@bank.com',
    password: bcrypt.hashSync('bank', config.SALT_ROUND),
    createdAt: new Date(),
    updatedAt: new Date(),
};

const accountBank = {
    userId: 5,
    iban: 'BANKBANKBANK',
    balance: 1000000,
    blocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
};

module.exports = { userBank, accountBank }