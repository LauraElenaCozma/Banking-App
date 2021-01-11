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

        address: {
            type: addressType,
            args: {
                addressId: {
                    type: GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: async (_, { addressId }) => {
                //TODO: check if it needs a context
                const address = await models.Address.findByPk(addressId);
                return address;
            }
        },

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

        getPromotions: {
            type: GraphQLList(promotionType),
            args: {},
            resolve: async (_, { }) => {
                const promotions = await models.Promotion.findAll();
                return promotions;
            }
        },

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
                console.log("transaction");
                if (!transaction) {
                    throw new GraphQLError(errorName.RESOURCE_NOT_EXISTS);
                }
                console.log(transaction);
                const { user } = context;
                // checks if the account with the given iban exists

                //console.log(transaction.id_account_from);
                const accountFrom = await models.Account.findByPk(transaction.id_account_from);
                //console.log(accountFrom);
                const userFrom = await accountFrom.getUser();
                const accountTo = await models.Account.findByPk(transaction.id_account_to);
                const userTo = await accountTo.getUser();

                if (userFrom.id != user.id && userTo.id != user.id) {

                    // transaction does not belong to this user
                    throw new GraphQLError(errorName.UNAUTHORIZED);
                }

                return transaction;
            }
        },
        transactions: {
            type: GraphQLList(transactionType),
            args: {},
            resolve: async (_, { }, context) => {
                // checks if user is authenticated
                // TODO what does this do?
                checkUserAuth(context);

                const { user } = context;
                const transactions = await models.Transaction.findAll();


                return transactions;
            }
        }
    }
});

module.exports = queryType;