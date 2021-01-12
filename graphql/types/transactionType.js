const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat } = require('graphql');

const transactionType = new GraphQLObjectType({
    name: 'Transaction',
    fields: {
        id: { type: GraphQLInt },
        iban_from: { type: GraphQLString },
        iban_to: { type: GraphQLString },
        sum: { type: GraphQLFloat },
        date: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
    }
});

module.exports = transactionType;