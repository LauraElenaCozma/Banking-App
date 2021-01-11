const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLString, GraphQLError } = require('graphql');
const models = require('../models');
const userType = require('./types/userType.js');
const addressType = require('./types/addressType.js');
const accountType = require('./types/accountType.js');
const { errorName } = require('../utils/errors.js');
const checkUserAuth = require('../utils/authCheck.js');

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        user: {
            type: userType,
            args: {
                userId: {
                    type: GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: async (_, { userId }) => {
                const user = await models.User.findByPk(userId);
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
                const address = await models.Address.findByPk(addressId);
                return address;
            }
        },

        accounts: {
            type: GraphQLList(accountType),
            args: {
                userId: {
                    type: GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: async (_, { userId }) => {
                const user = await models.User.findByPk(userId);
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

    }
});

module.exports = queryType;