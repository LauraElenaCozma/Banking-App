const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat } = require('graphql');

const transactionType = new GraphQLObjectType({
    name: 'Transaction',
    fields: {
        id: { type: GraphQLInt },
        id_account_from: { type: GraphQLInt },
        id_account_to: { type: GraphQLInt },
        sum: { type: GraphQLFloat },
        date: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
    }
});

module.exports = transactionType;