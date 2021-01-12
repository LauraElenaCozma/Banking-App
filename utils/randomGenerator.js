const faker = require('faker');
function generateIban() {
    return faker.finance.iban();
}

module.exports = generateIban;