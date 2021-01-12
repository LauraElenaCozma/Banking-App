const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } = require('graphql');
const addressType = require('./addressType.js');
const models = require('../../models');
const accountType = require('./accountType.js');

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
                const address = await parent.getAddress();
                return address;
            }
        },

        accounts: {
            type: GraphQLList(accountType),
            resolve: async(parent) => {
                return await parent.getAccounts();
            }
        }
        
    })
});

module.exports = userType;