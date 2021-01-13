const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } = require('graphql');
const addressType = require('./addressType.js');
const accountType = require('./accountType.js');
const promotionType = require('./promotionType.js');

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
            resolve: async (parent) => {
                return await parent.getAccounts();
            }
        },

        // get user's promotions
        promotions: {
            type: GraphQLList(promotionType),
            resolve: async (parent) => {
                const promotions = await parent.getPromotions();
                return promotions;
            }
        },
    })
});

module.exports = userType;