const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat, GraphQLBoolean, GraphQLSchema } = require('graphql');

const accountType = new GraphQLObjectType({
    name: 'Account',
    fields: {
        id: { type: GraphQLInt },
        userId: { type: GraphQLInt },
        iban: { type: GraphQLString },
        balance: { type: GraphQLFloat },
        blocked: { type: GraphQLBoolean },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
    }
});

module.exports = accountType;