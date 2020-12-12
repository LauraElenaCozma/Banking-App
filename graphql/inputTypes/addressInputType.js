const { GraphQLInputObjectType, GraphQLString, GraphQLInt } = require('graphql');

const addressInputType = new GraphQLInputObjectType({
    name: 'AddressInput',
    fields: {
        street: { type: GraphQLString },
        userId: { type: GraphQLInt },
        no: { type: GraphQLInt },
        city: { type: GraphQLString },
        country: { type: GraphQLString }
    }
});

module.exports = addressInputType;