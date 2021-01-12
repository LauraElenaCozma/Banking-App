const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLString, GraphQLError, GraphQLFloat } = require('graphql');
const models = require('../models');
const userType = require('./types/userType.js');
const addressType = require('./types/addressType.js');
const accountType = require('./types/accountType.js');
const transactionType = require('./types/transactionType.js');
const { errorName } = require('../utils/errors.js');
const checkUserAuth = require('../utils/authCheck.js');
const promotionType = require('./types/promotionType.js');
const getMaxTransaction = require('../utils/transactionUtils.js');

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

        // get address details
        address: {
            type: addressType,
            args: {},
            resolve: async (_, { }, context) => {
                // checks if user is authenticated
                checkUserAuth(context);
                const { user } = context;

                const address = await user.getAddress();
                return address;
            }
        },

        // gets user accounts
        accounts: {
         
            type: GraphQLList(accountType),
            args: {},
            resolve: async (_, { }, context) => {
                // checks if user is authenticated
                checkUserAuth(context);

                const { user } = context;
                const accounts = await user.getAccounts();
                return accounts;
            }
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

        // get user promotions
        getPromotionsOfUser: {
            type: GraphQLList(promotionType),
            args: {},
            resolve: async (_, { }, context) => {
                // checks if user is authenticated
                checkUserAuth(context);

                const { user } = context;
                const promotions = await user.getPromotions();
                return promotions;
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
            resolve: async (_, { userId }) => {

                const { user } = context;
                // checks if user is authenticated
                checkUserAuth(context);

                return await getMaxTransaction(user);
            }
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

                if (userFrom.id != user.id && userTo.id != user.id) {
                    // transaction does not belong to this user
                    throw new GraphQLError(errorName.UNAUTHORIZED);
                }

                return transaction;
            }
        },

        // same thing as nested query from accountType
        // transactionsSendMoney: {
        //     // gets all the transactions for the authenticated user 
        //     // (the ones he sent money, not received)

        //     type: GraphQLList(transactionType),
        //     args: {
        //         iban: {
        //             type: GraphQLNonNull(GraphQLString)
        //         },
        //     },
        //     resolve: async (_, { iban }, context) => {
        //         // checks if user is authenticated
        //         checkUserAuth(context);

        //         // checks if the account with the given iban exists
        //         const account = await models.Account.findByPk(iban);

        //         if (!account) {
        //             throw new GraphQLError(errorName.RESOURCE_NOT_EXISTS);
        //         }

        //         const { user } = context;
        //         const accountUser = await account.getUser();

        //         if (accountUser.id != user.id) {
        //             // account does not belong to this user
        //             throw new GraphQLError(errorName.UNAUTHORIZED);
        //         }
        //         const transactions = await account.getTransactions();

        //         return transactions;
        //     }
        // },

        // same thing as nested query from accountType
        // transactionsReceivedMoney: {
        //     // gets all the transactions for the authenticated user 
        //     // (the ones he received money, not sent)

        //     type: GraphQLList(transactionType),
        //     args: {
        //         iban: {
        //             type: GraphQLNonNull(GraphQLString)
        //         },
        //     },
        //     resolve: async (_, { iban }, context) => {
        //         // checks if user is authenticated
        //         checkUserAuth(context);

        //         // checks if the account with the given iban exists
        //         const account = await models.Account.findByPk(iban);

        //         if (!account) {
        //             throw new GraphQLError(errorName.RESOURCE_NOT_EXISTS);
        //         }

        //         const { user } = context;
        //         const accountUser = await account.getUser();

        //         if (accountUser.id != user.id) {
        //             // account does not belong to this user
        //             throw new GraphQLError(errorName.UNAUTHORIZED);
        //         }
        //         const transactions = await models.Transaction.findAll({
        //             where: {
        //                 iban_to: iban
        //             }
        //         });

        //         return transactions;
        //     }
        // },

        
    }
});

module.exports = queryType;