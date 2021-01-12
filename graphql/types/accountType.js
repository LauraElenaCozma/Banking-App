const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat, GraphQLBoolean, GraphQLList, GraphQLSchema } = require('graphql');
const transaction = require('../../models/transaction');
const transactionType = require('./transactionType');
const models = require('../../models');
const { Op } = require('sequelize');

const accountType = new GraphQLObjectType({
    name: 'Account',
    fields: {
        iban: { type: GraphQLString },
        userId: { type: GraphQLInt },
        balance: { type: GraphQLFloat },
        blocked: { type: GraphQLBoolean },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },

        // get all the transactions of an account 
        transactionsSent: {
            type: GraphQLList(transactionType),
            resolve: async (parent) => {
                return await parent.getTransactions();
            }
        },

        transactionsReceived: {
            type: GraphQLList(transactionType),
            resolve: async (parent) => {
                const transactions = await models.Transaction.findAll({
                    where: {
                        iban_to: parent.iban
                    }
                });

                return transactions;
            }
        },
        
        // gets all transactions (sent and recevied money)
        allTransactions: {
            type: GraphQLList(transactionType),
            resolve: async (parent) => {
                const transactions = await models.Transaction.findAll({
                    where: {
                        [Op.or]: [
                            { iban_to: parent.iban },
                            { iban_from: parent.iban }
                        ]
                    },
                    order: ['date'],
                });

                return transactions;
            }
        },

        // get all transactions (send and received money this month)

    }
});

module.exports = accountType;