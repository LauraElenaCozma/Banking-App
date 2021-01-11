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
const transactionType = require('./types/transactionType.js');
const getMaxTransaction = require('../utils/transactionUtils');

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
                const user = await models.User.create(userInput);

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

                if (accountUser.id != user.id) {
                    // account does not belong to this user
                    throw new GraphQLError(errorName.UNAUTHORIZED);
                }

                // create transaction
                const transaction = await models.Transaction.create({
                    sum: money,
                    date: new Date(),
                    id_account_from: accountUser.id,
                    id_account_to: accountUser.id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                account.balance += money;
                await account.save();
                return account.balance;
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
                if (promotion == null) {
                    //TODO:change return
                    return "The promotion having this id does not exist!";
                }

                const user = await models.User.findByPk(userId);
                const activePromotions = await user.getPromotions();
                activePromotions.forEach(promotion => {
                    if (promotion.id == promotionId)
                        return "The promotion is already added";
                });
                //nu intra pe return
                const account = await models.Account.findOne({ where: { iban: accountIban } });
                if (account == null) {
                    return "The iban is incorrect!";
                }
                await user.addPromotion(promotion, { through: { edit: true } });
                account.balance -= promotion.price;
                await account.save();

                //TODO: adauga tranzactie
                // TODO: creeaza user banca si cont pt banca astfel incat sa avem ce pune pe iban_to
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
                if (promotion == null) {
                    //TODO:change return
                    return "The promotion having this id does not exist!";
                }
                const user = await models.User.findByPk(userId);
                await user.removePromotion(promotion);
                return promotion;
            }
        },

        createTransaction: {
            type: transactionType,
            args: {
                iban_from: {
                    type: GraphQLNonNull(GraphQLString)
                },
                iban_to: {
                    type: GraphQLNonNull(GraphQLString)
                },
                sum: {
                    type: GraphQLNonNull(GraphQLFloat)
                }
            },
            resolve: async (_, { iban_from, iban_to, sum }, context) => {
                // checks if user is authenticated
                checkUserAuth(context);

                // checks if the giving account with the given iban exists
                const account_from = await models.Account.findOne({
                    where: { iban: iban_from }
                });

                if (!account_from) {
                    throw new GraphQLError(errorName.SENDING_IBAN_NOT_EXISTS);
                }

                // checks if the receiving account with the given iban exists
                const account_to = await models.Account.findOne({
                    where: { iban: iban_to }
                });

                if (!account_to) {
                    throw new GraphQLError(errorName.RECEIVING_IBAN_NOT_EXISTS);
                }

                const { user } = context;
                const accountUser = await account_from.getUser();

                // check if account belongs to user
                if (accountUser.id != user.id) {
                    throw new GraphQLError(errorName.UNAUTHORIZED);
                }

                // check if sending account is not blocked
                if (account_from.blocked) {
                    throw new GraphQLError(errorName.ACCOUNT_BLOCKED);
                }

                // check if the user can make this transaction (regarding promotions)
                const maxTransaction = await getMaxTransaction(user);
                if (maxTransaction < sum) {
                    throw new GraphQLError(errorName.PROMOTION_NOT_ALLOWED);
                }

                // check if the account has enough money
                if (sum > account_from.balance) {
                    throw new GraphQLError(errorName.NOT_ENOUGH_MONEY);
                }

                // create transaction
                const transaction = await models.Transaction.create({
                    sum,
                    date: new Date(),
                    id_account_from: account_from.id,
                    id_account_to: account_to.id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                account_from.balance -= sum;
                account_to.balance += sum;

                await account_from.save();
                await account_to.save();

                return transaction;
            }
        }
    }
});

module.exports = mutationType;