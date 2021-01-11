const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLError, graphql } = require('graphql');
const models = require('../models');
const addressInputType = require('./inputTypes/addressInputType.js');
const addressType = require('./types/addressType.js');
const userType = require('./types/userType');
const userInputType = require('./inputTypes/userInputType.js')
const accountType = require('./types/accountType.js');
const jwt = require('jsonwebtoken')
const accountInputType = require('./inputTypes/accountInputType.js');
const config = require('../config/configSecretKey.js');
const { errorName } = require('../utils/errors.js');
const checkUserAuth = require('../utils/authCheck.js');
const generateIban = require('../utils/randomGenerator.js');
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
                // checks if user is authenticated
                checkUserAuth(context);
                const { user } = context;
                accountInput.iban = generateIban();
                const account = await user.createAccount(accountInput);
                return account;
            }
        },

        createUser: {
            type: userType,
            args: {
                userInput: {
                    type: GraphQLNonNull(userInputType)
                },
                addressInput: {
                    type: GraphQLNonNull(addressInputType)
                }
            },
            resolve: async (_, { userInput, addressInput }) => {
                // encrypt the received password not to store it in plain text in db
                userInput.password = bcrypt.hashSync(userInput.password, config.SALT_ROUND);

                await user.createAddress({
                    street: addressInput.street,
                    no: addressInput.no,
                    city: addressInput.city,
                    country: addressInput.country
                });

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
            resolve: async (_, { email, password }) => {
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

        addMoneyToAccount: {
            type: GraphQLFloat,
            args: {
                money: {
                    type: GraphQLNonNull(GraphQLFloat)
                },
                iban: {
                    type: GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (_, { iban, money }, context) => {
                // checks if user is authenticated
                checkUserAuth(context);

                // checks if the account with the given iban exists
                const account = await models.Account.findOne({
                    where: { iban }
                });

                if (!account) {
                    throw new GraphQLError(errorName.RESOURCE_NOT_EXISTS);
                }

                const { user } = context;
                const accountUser = await account.getUser();

                if (accountUser.id == user.id) {
                    account.balance += money;
                    await account.save();
                    return account.balance;
                }

                // account does not belong to this user
                throw new GraphQLError(errorName.UNAUTHORIZED);
            }
        },

        addPromotionToUser: {
            type: promotionType,
            args: {
                promotionId: {
                    type: GraphQLNonNull(GraphQLInt)
                },
                accountIban: {
                    type: GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (_, { promotionId, accountIban }, context) => {
                // checks if user is authenticated
                checkUserAuth(context);

                const promotion = await models.Promotion.findByPk(promotionId);
                if (promotion == null)
                {
                    //TODO:change return
                    return "The promotion having this id does not exist!";
                }
                
                const {user} = context;
                const activePromotions = await user.getPromotions();
                activePromotions.forEach(promotion => {
                    if(promotion.id == promotionId)
                    throw new GraphQLError(errorName.RESOURCE_ALREADY_EXISTS);
                });

                const account = await models.Account.findOne({ where: { iban: accountIban } });
                if (!account)
                {
                    throw new GraphQLError(errorName.RESOURCE_NOT_EXISTS);
                }
                const accountUser = await account.getUser();

                if (accountUser.id != user.id) {
                    // account does not belong to this user
                    //TODO: se poate sa platesti promotia cu contul altcuiva?
                    throw new GraphQLError(errorName.UNAUTHORIZED); 
                }
                await user.addPromotion(promotion, { through: { edit: true }});

                account.balance -= promotion.price;
                await account.save();

                //TODO: verifica ce returneaza
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
                promotionId: {
                    type: GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: async (_, { promotionId }, context) => {
                // checks if user is authenticated
                checkUserAuth(context);

                const promotion = await models.Promotion.findByPk(promotionId);
                if (promotion == null)
                {
                    throw new GraphQLError(errorName.RESOURCE_NOT_EXISTS);
                }
                const {user} = context;
                await user.removePromotion(promotion);
                return promotion;
            }
        },
    }
});

module.exports = mutationType;