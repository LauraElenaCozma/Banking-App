const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat, GraphQLBoolean, GraphQLSchema } = require('graphql');

const accountType = new GraphQLObjectType({
    name: 'Account',
    fields: {
        iban: { type: GraphQLString },
        userId: { type: GraphQLInt },
        balance: { type: GraphQLFloat },
        blocked: { type: GraphQLBoolean },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
    }
});

module.exports = accountType;