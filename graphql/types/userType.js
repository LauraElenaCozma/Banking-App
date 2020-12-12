const { GraphQLObjectType, GraphQLInt, GraphQLString } = require('graphql');
const addressType = require('./addressType.js');
const models = require('../../models');

const userType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLInt },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        phone: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },

        address: {
            type: addressType,
            resolve: async (parent) => {
                const address = parent.getAddress();
                return address;
            }
        }
    })
});

module.exports = userType;