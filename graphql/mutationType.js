const { address } = require('faker');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } = require('graphql');
const models = require('../models');
const addressInputType = require('./inputTypes/addressInputType.js');
const addressType = require('./types/addressType.js');

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
                console.log(addressInput);
                // const { user } = context;

                // if(!user) {
                    // return null;
                // }

            const user = await models.User.findByPk(addressInput.userId);
            const address = await user.createAddress(addressInput);
            return address
            }
        }
    }
});

module.exports = mutationType;