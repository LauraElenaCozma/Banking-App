const express = require('express');
const app = express();
const port = 3000;

const models = require('./models');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');



const schema = buildSchema(`
type User {
    id: Int
    firstName: String
    lastName: String
    phone: String
    email: String
    password: String
    createdAt: String
    updatedAt: String
}
type Account {
    id: Int
    userId: Int
    iban: String
    balance: Float 
    blocked: Boolean
    createdAt: String
    updatedAt: String
}
type Promotion {
    id: Int
    name: String
    price: Float
    startDate: String
    endDate: String
    maxNoOfAccounts: Int
    maxSumOfTransactions: Int
    createdAt: String
    updatedAt: String
}
type UserPromotion {
    id: Int
    userId: Int
    promotionId: Int
    createdAt: String
    updatedAt: String
}
type Query {
    user(userId: Int!): User
    account(userId: Int!): [Account]
    promotion(promotionId: Int!): Promotion
    promotionsOfUser(userId: Int!): [Promotion]
}
type Mutation {
    createUserPromotion(userId: Int, promotionId: Int): UserPromotion
}`);

const rootValue = {
    user: async ({userId}) => {
        const user = await models.User.findByPk(userId);
        return user;
    },
    /*query GetUser{
  user(userId: 3){
    id
    firstName
    lastName
    email
    password
    createdAt
    updatedAt
  }
}*/
    account: async ({userId}) => {
        const user = await models.User.findByPk(userId);
        const accounts = await user.getAccounts();
        return accounts;
    },
    /*query GetAccountsOfUser{
  account(userId:3){
    iban
    balance
    blocked
  }
}*/
    promotionsOfUser: async ({userId}) => {
        //get all the promotions of an user
        const user = await models.User.findByPk(userId);
        const promotions = await user.getPromotions();

        return promotions;
    },
    /*query GetPromotionsOfUser{
  promotionsOfUser(userId:3) {
    name
    price
    startDate
    endDate
    maxNoOfAccounts
    maxSumOfTransactions
  }
}*/
    createUserPromotion: async ({userId, promotionId}) => {
        const user = await models.User.findByPk(userId);
        const promotion = await models.Promotion.findByPk(promotionId);
        await user.addPromotion(promotion);	
        //what should be returned?
        //TODO: change return into the added userPromotion
        return userPromotion;
    },
    /*query GetPromotionsOfUser{
  promotionsOfUser(userId:3) {
    name
    price
    startDate
    endDate
    maxNoOfAccounts
    maxSumOfTransactions
  }
}
*/
    promotion: async ({promotionId}) => {
        const promotion = await models.Promotion.findByPk(promotionId); 
        return promotion;
    },
    /*query GetPromotion {
  promotion(promotionId: 4) {
    id
    name
    price
    startDate
    endDate
    maxNoOfAccounts
    maxSumOfTransactions
  }
}*/
}


app.use('/graphql', graphqlHTTP({
    schema,
    rootValue,
}));

app.listen(port, () => {
    console.log('Server started!')
});
