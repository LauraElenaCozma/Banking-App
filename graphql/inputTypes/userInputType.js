const { GraphQLInputObjectType, GraphQLString } = require('graphql');

const userInputType = new GraphQLInputObjectType({
    name: 'UserInput',
    fields: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        phone: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    }
});

module.exports = userInputType;