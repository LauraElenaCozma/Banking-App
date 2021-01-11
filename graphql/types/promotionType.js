const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat, GraphQl, GraphQLSchema } = require('graphql');
const userType = require('./userType.js');

const promotionType = new GraphQLObjectType({
    name: 'Promotion',
    fields: {
        id: { type: GraphQLInt },
        userId: { type: GraphQLInt },
        name: { type: GraphQLString },
        price: {type: GraphQLFloat},
        startDate: { type: GraphQLString },
        endDate: { type: GraphQLString },
        maxNoOfAccounts: { type: GraphQLInt },
        maxSumOfTransactions: { type: GraphQLInt },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
    }
});

module.exports = promotionType;