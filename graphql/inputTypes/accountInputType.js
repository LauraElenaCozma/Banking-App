const { GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLFloat } = require('graphql');

const accountInputType = new GraphQLInputObjectType({
    name: 'AccountInput',
    fields: {
        balance: { type: GraphQLFloat },
        blocked: { type: GraphQLBoolean }
    }
});

module.exports = accountInputType;