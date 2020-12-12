const { GraphQLSchema } = require('graphql');
const queryType = require('./queryType.js');
const mutationType = require('./mutationType.js');

module.exports = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});