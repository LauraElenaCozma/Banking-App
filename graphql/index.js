const { GraphQLSchema } = require('graphql');
const queryType = require('./queryType.js');
const mutationType = require('./mutationType.js');

module.exports = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});


/*query iaUserSiAdresa{
  user(userId: 3) {
    id
    password
    email
    address {
      street
      no
    }
  }
}

query GetAccountsOfUser{
accounts(userId:3){
  iban
  balance
  blocked
}
}
 
query iaAdresa {
  address(addressId: 3) {
    id
    street
    no
  }
}
 
mutation adaugaAdresa($addressInput: AddressInput!) {
createAddress(addressInput: $addressInput) {
  street
  no
  country
  city
}
}

mutation addAccount($accountInput: AccountInput!) {
  createAccount(accountInput: $accountInput) {
    id
    userId
    iban
    balance
    blocked
    createdAt
    updatedAt
  }
}

mutation adaugaUser($userInput: UserInput!) {
  createUser(userInput: $userInput) {
    id
    firstName
    password
  }
}

VARIABLES:
{
"accountInput": {
"userId": 2,
"iban": "RO492199304851SHK32",
 "balance": 3000,
  "blocked": false
},
 "userInput": {
    "firstName": "prenume",
    "lastName": "nume",
    "phone": "0745260593",
    "email": "email@gmail.com",
    "password": "passwordSuperSecreta"
  }
}
*/