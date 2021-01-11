const { GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLFloat } = require('graphql');

const promotionInputType = new GraphQLInputObjectType({
    name: 'PromotionInput',
    fields: {
        userId: { type: GraphQLInt },
        name: { type: GraphQLString },
        price: {type: GraphQLFloat},
        startDate: { type: GraphQLString },
        endDate: { type: GraphQLString },
        maxNoOfAccounts: { type: GraphQLInt },
        maxSumOfTransactions: { type: GraphQLInt }
    }
});

module.exports = promotionInputType;