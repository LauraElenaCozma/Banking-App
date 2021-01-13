const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLString, GraphQLError, GraphQLFloat } = require('graphql');
const models = require('../models');
const userType = require('./types/userType.js');
const accountType = require('./types/accountType.js');
const transactionType = require('./types/transactionType.js');
const { errorName } = require('../utils/errors.js');
const checkUserAuth = require('../utils/authCheck.js');
const promotionType = require('./types/promotionType.js');
const {getMaxTransaction, getMaxNoAccounts}  = require('../utils/transactionUtils.js');

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        // get user details
        user: {
            type: userType,
            args: {},
            resolve: async (_, { }, context) => {
                // checks if user is authenticated
                checkUserAuth(context);

                const { user } = context;
                return user;
            },
        },

        // get user account
        account: {
            type: accountType,
            args: {
                iban: {
                    type: GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (_, { iban }, context) => {
                // checks if user is authenticated
                checkUserAuth(context);

                // checks if the account with the given iban exists
                const account = await models.Account.findOne({
                    where: { iban }
                });

                if (!account) {
                    throw new GraphQLError(errorName.RESOURCE_NOT_EXISTS);
                }

                const { user } = context;
                const accountUser = await account.getUser();

                if (accountUser.id == user.id) {
                    return account;
                }

                // account does not belong to this user
                throw new GraphQLError(errorName.UNAUTHORIZED);
            }
        },

        // get all the available promotions
        getPromotions: {
            type: GraphQLList(promotionType),
            args: {},
            resolve: async (_, { }) => {
                const promotions = await models.Promotion.findAll();
                return promotions;
            }
        },

        // get the maximum transaction a user can make
        getMaxTransaction: {
            type: GraphQLString,
            args: {},
            resolve: async (_, { }, context) => {

                const { user } = context;
                // checks if user is authenticated
                checkUserAuth(context);

                return await getMaxTransaction(user);
            }
        },
        // get the maximum number of accounts that a user can have
        getMaxNoOfAccounts: {
            type: GraphQLString,
            args: {},
            resolve: async (_, { }, context) => {

                const { user } = context;
                // checks if user is authenticated
                checkUserAuth(context);

                return await getMaxNoAccounts(user);
            }
        },

        // get all transactions (only the bank can do it)
        transactions: {

            type: GraphQLList(transactionType),
            resolve: async (_, { }, context) => {
                // checks if user is authenticated
                checkUserAuth(context);

                const { user } = context;

                //check if the logged user is the bank; only the bank can get all the transactions
                if (user.email != 'bank@bank.com') {
                    throw new GraphQLError(errorName.UNAUTHORIZED);
                }
                
                // ordered by date
                const transactions = await models.Transaction.findAll({
                    order: ['date'],
                });
                return transactions;

            },
        },

        // get details about a transaction
        transaction: {
            type: transactionType,
            args: {
                transactionId: {
                    type: GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: async (_, { transactionId }, context) => {
                // checks if user is authenticated
                checkUserAuth(context);

                const transaction = await models.Transaction.findByPk(transactionId);
                if (!transaction) {
                    throw new GraphQLError(errorName.RESOURCE_NOT_EXISTS);
                }

                const accountFrom = await models.Account.findByPk(transaction.iban_from);
                const accountTo = await models.Account.findByPk(transaction.iban_to);

                const userFrom = await accountFrom.getUser();
                const userTo = await accountTo.getUser();

                const { user } = context;
                if (userFrom.id != user.id && userTo.id != user.id) {
                    // transaction does not belong to this user
                    throw new GraphQLError(errorName.UNAUTHORIZED);
                }

                return transaction;
            }
        },


    }
});

module.exports = queryType;