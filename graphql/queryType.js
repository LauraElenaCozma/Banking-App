const { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLInt } = require('graphql');
const models = require('../models');
const userType = require('./types/userType.js');
const addressType = require('./types/addressType.js');
const accountType = require('./types/accountType.js');

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
    }
});

module.exports = queryType;