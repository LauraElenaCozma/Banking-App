const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLSchema } = require('graphql');
const userType = require('./userType.js');

const addressType = new GraphQLObjectType({
    name: 'Address',
    fields: {
        id: { type: GraphQLInt },
        street: { type: GraphQLString },
        no: { type: GraphQLInt },
        city: { type: GraphQLString },
        country: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
    }
});

module.exports = addressType;