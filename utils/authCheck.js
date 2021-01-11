const { GraphQLError } = require('graphql');
const { errorName } = require('./errors.js');

function checkUserAuth(context) {
    if (!context.user) {
        throw new GraphQLError(errorName.USER_NOT_AUTHENTICATED);
    }
    return true;
}

module.exports = checkUserAuth; 