const { address } = require('faker');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } = require('graphql');
const models = require('../models');
const addressInputType = require('./inputTypes/addressInputType.js');
const addressType = require('./types/addressType.js');
const userType = require('./types/userType');
const userInputType = require('./inputTypes/userInputType.js')
const accountType = require('./types/accountType.js');
const jwt = require('jsonwebtoken')
const accountInputType = require('./inputTypes/accountInputType.js');
const config = require('../config/configSecretKey.js');
const bcrypt = require('bcrypt');
const promotionInputType = require('./inputTypes/promotionInputType');
const promotionType = require('./types/promotionType');
const userPromotionInputType = require('./inputTypes/userPromotionInputType');

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createAddress: {
            type: addressType,
            args: {
                addressInput: {
                    type: GraphQLNonNull(addressInputType)
                }
            },
            resolve: async (_, { addressInput }, context) => {

                const user = await models.User.findByPk(addressInput.userId);
                const address = await user.createAddress(addressInput);
                return address;
            }
        },
        createAccount: {
            type: accountType,
            args: {
                accountInput: {
                    type: GraphQLNonNull(accountInputType)
                }
            },
            resolve: async (_, { accountInput }, context) => {
                const user = await models.User.findByPk(accountInput.userId);
                const account = await user.createAccount(accountInput);
                return account;
            }
        },

        createUser: {
            type: userType,
            args: {
                userInput: {
                    type: GraphQLNonNull(userInputType)
                }
            },
            resolve: async (_, { userInput }) => {
                // encrypt the received password not to store it in plain text in db
                userInput.password = bcrypt.hashSync(userInput.password, config.SALT_ROUND);
                const user = await models.User.create(userInput);
                return user;
            }
        },

        login: {
            type: GraphQLString,
            args: {
                email: {
                    type: GraphQLNonNull(GraphQLString),
                },
                password: {
                    type: GraphQLNonNull(GraphQLString),
                },
            },
            resolve: async (parent, { email, password }) => {
                const user = await models.User.findOne({
                    where: {
                        email
                    }
                });
                if (user) {
                    const isValid = await bcrypt.compare(password, user.password);
                    if (isValid) {
                        // Pasam `userId` in token pentru a-l folosi la validarea tokenului (authenticationMiddleware)
                        const token = jwt.sign({ userId: user.id }, config.JWTSECRET);
                        return token;
                    }
                    return null;
                }
            }
        },
        addPromotionToUser: {
            type: promotionType,
            args: {
                userId: {
                    type: GraphQLNonNull(GraphQLInt)
                },
                promotionId: {
                    type: GraphQLNonNull(GraphQLInt)
                },
                accountIban: {
                    type: GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (_, { userId, promotionId, accountIban }, context) => {
                const promotion = await models.Promotion.findByPk(promotionId);
                if (promotion == null)
                {
                    //TODO:change return
                    return "The promotion having this id does not exist!";
                }
                
                const user = await models.User.findByPk(userId);
                const activePromotions = await user.getPromotions();
                activePromotions.forEach(promotion => {
                    if(promotion.id == promotionId)
                        return "The promotion is already added";
                });
                //nu intra pe return
                const account = await models.Account.findOne({ where: { iban: accountIban } });
                if (account == null)
                {
                    return "The iban is incorrect!";
                }
                await user.addPromotion(promotion, { through: { edit: true }});
                account.balance -= promotion.price;
                //nu se scade din valoarea contului
                //TODO: adauga tranzactie
                /*const result = await User.findOne({
                    where: { userId: userId},
                    //include: Profile
                  });
                  return result;*/
                return promotion;
            }

        },
        removePromotionOfUser: {
            type: promotionType,
            args: {
                userId: {
                    type: GraphQLNonNull(GraphQLInt)
                },
                promotionId: {
                    type: GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: async (_, { userId, promotionId }) => {
                const promotion = await models.Promotion.findByPk(promotionId);
                if (promotion == null)
                {
                    //TODO:change return
                    return "The promotion having this id does not exist!";
                }
                const user = await models.User.findByPk(userId);
                await user.removePromotion(promotion);
                return promotion;
            }
        },
    }
});

module.exports = mutationType;