const { GraphQLInputObjectType, GraphQLInt } = require('graphql');

const userPromotionInputType = new GraphQLInputObjectType({
    name: 'UserPromotionInput',
    fields: {
        userId: { type: GraphQLInt },
        promotionId: {type: GraphQLInt}
    }
});

module.exports = userPromotionInputType;