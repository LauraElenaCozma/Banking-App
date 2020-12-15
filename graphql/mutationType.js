const { address } = require('faker');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } = require('graphql');
const models = require('../models');
const addressInputType = require('./inputTypes/addressInputType.js');
const addressType = require('./types/addressType.js');
const accountInputType = require('./inputTypes/accountInputType.js');
const accountType = require('./types/accountType.js');

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createAddress: {
            type: addressType,
            args: {
                addressInput: {
                    type: GraphQLNonNull(addressInputType)
                }
            },
            resolve: async (_, { addressInput }, context) => {
                const user = await models.User.findByPk(addressInput.userId);
                const address = await user.createAddress(addressInput);
                return address;
            }
        },
        createAccount: {
            type: accountType,
            args: {
                accountInput: {
                    type: GraphQLNonNull(accountInputType)
                }
            },
            resolve: async (_, { accountInput }, context) => {
                const user = await models.User.findByPk(accountInput.userId);
                const account = await user.createAccount(accountInput);
                return account;
            }
        }
    }
});

module.exports = mutationType;