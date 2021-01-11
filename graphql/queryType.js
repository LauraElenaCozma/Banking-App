const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList } = require('graphql');
const models = require('../models');
const userType = require('./types/userType.js');
const addressType = require('./types/addressType.js');
const accountType = require('./types/accountType.js');
const promotionType = require('./types/promotionType.js');

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        user: {
            type: userType,
            args: {
                userId: {
                    type: GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: async (_, { userId }) => {
                const user = await models.User.findByPk(userId);
                return user;
            },
        },

        address: {
            type: addressType,
            args: {
                addressId: {
                    type: GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: async (_, { addressId }) => {
                const address = await models.Address.findByPk(addressId);
                return address;
            }
        },
        accounts: {
            type: GraphQLList(accountType),
            args: {
                userId: {
                    type: GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: async (_, { userId }) => {
                const user = await models.User.findByPk(userId);
                const accounts = await user.getAccounts();
                return accounts;
            }
        },

        account: {
            type: accountType,
            args: {
                accountId: {
                    type: GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: async (_, { accountId }) => {
                const account = await models.Account.findByPk(accountId);
                return account;
            }
        },

        getPromotionsOfUser: {
            type: GraphQLList(promotionType),
            args: {
                userId: {
                    type: GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: async (_, { userId }) => {
                const user = await models.User.findByPk(userId);
                const promotions = await user.getPromotions();
                return promotions;
            }
        },

        getPromotions: {
            type: GraphQLList(promotionType),
            args: {},
            resolve: async (_, {}) => {
                const promotions = await models.Promotion.findAll();
                return promotions;
            }
        },

        getMaxTransaction: {
            type: GraphQLString,
            args: {
                userId: {
                    type: GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: async (_, { userId }) => {
                let maxSum = 0;
                const user = await models.User.findByPk(userId);
                const promotions = await user.getPromotions();
                promotions.forEach(promotion => {
                    if(maxSum != null) { //maxSum == null -> the maximum sum is undefined; there is no limit
                        if(promotion.maxSumOfTransactions == null)
                            maxSum = null;
                        else if(promotion.endDate == null && maxSum < promotion.maxSumOfTransactions) {
                            maxSum = promotion.maxSumOfTransactions;
                        }
                        else {
                            let endDate = new Date(promotion.endDate);
                            let currentDate = new Date();
                            if(endDate > currentDate && maxSum < promotion.maxSumOfTransactions) {
                                maxSum = promotion.maxSumOfTransactions;
                            } 
                        }
                    }
                });
                if(maxSum == null)
                    return "No limit for transactions";
                else return "The limit for one transaction is " + maxSum.toString();
            }
        }
    }
});

module.exports = queryType;