const { address } = require('faker');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } = require('graphql');
const models = require('../models');
const addressInputType = require('./inputTypes/addressInputType.js');
const addressType = require('./types/addressType.js');
const userType = require('./types/userType');
const userInputType = require('./inputTypes/userInputType.js')

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
                // const { user } = context;

                // if(!user) {
                    // return null;
                // }

            const user = await models.User.findByPk(addressInput.userId);
            const address = await user.createAddress(addressInput);
            return address
            }
        },

        createUser: {
            type: userType,
            args: {
                userInput: {
                    type: GraphQLNonNull(userInputType)
                }
            },
            resolve: async(_, { userInput }) => {
                const user = await models.User.create(userInput);
                return user;
            }
        }
    }
});

module.exports = mutationType;