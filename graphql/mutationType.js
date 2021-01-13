const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLError, graphql } = require('graphql');
const models = require('../models');
const addressInputType = require('./inputTypes/addressInputType.js');
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
const promotionType = require('./types/promotionType');
const promotionInputType = require('./inputTypes/promotionInputType.js');
const transactionType = require('./types/transactionType.js');
const {getMaxTransaction, getMaxNoAccounts} = require('../utils/transactionUtils');
const { accountBank, userBank } = require('../utils/bank.js')


const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
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

                // check if you can add another account regarding promotions
                let maxNoAccounts = await getMaxNoAccounts(user);
                const accounts = user.getAccounts();
                if (accounts.length >= maxNoAccounts)
                {
                    throw new GraphQLError(errorName.PROMOTION_NOT_ALLOWED);
                }

                accountInput.userId = user.id;
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
            resolve: async (_, { userInput, addressInput }, context) => {
                // to create a user, you shouldn't be logged in (no token in header)
                let { user } = context;
                if (user) {
                    throw new GraphQLError(errorName.USER_AUTHENTICATED);
                }

                // encrypt the received password not to store it in plain text in db
                userInput.password = bcrypt.hashSync(userInput.password, config.SALT_ROUND);
                user = await models.User.create(userInput);

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
            type: accountType,
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
                const account = await models.Account.findByPk(iban);

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
                    iban_from: accountBank.iban,
                    iban_to: account.iban,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                account.balance += money;
                await account.save();
                return account;
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
                const { user } = context;

                //check if the promotion exists
                const promotion = await models.Promotion.findByPk(promotionId);
                if (promotion == null) {
                    throw new GraphQLError(errorName.RESOURCE_NOT_EXISTS);
                }

                // check if the promotion does not already exist in the user's account
                const activePromotions = await user.getPromotions();
                activePromotions.forEach(promotion => {
                    if (promotion.id == promotionId)
                        throw new GraphQLError(errorName.RESOURCE_ALREADY_EXISTS);
                });

                // check if the account exists
                const account = await models.Account.findByPk(accountIban);
                if (!account) {
                    throw new GraphQLError(errorName.RESOURCE_NOT_EXISTS);
                }

                // check if the account is not blocked
                if (account.blocked) {
                    throw new GraphQLError(errorName.ACCOUNT_BLOCKED);
                }

                // check if the account belongs to this user
                const accountUser = await account.getUser();
                if (accountUser.id != user.id) {
                    throw new GraphQLError(errorName.UNAUTHORIZED);
                }

                // check if the account has enough money
                if (promotion.price > account.balance) {
                    throw new GraphQLError(errorName.NOT_ENOUGH_MONEY);
                }

                await user.addPromotion(promotion, { through: { edit: true } });

                //pay the promotion
                account.balance -= promotion.price;

                //create the transaction
                const transaction = await models.Transaction.create({
                    sum: promotion.price,
                    date: new Date(),
                    iban_from: accountIban,
                    iban_to: "BANKBANKBANK", 
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                await account.save();

                //TODO: verifica ce returneaza                

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

                //check if the promotion exists
                const promotion = await models.Promotion.findByPk(promotionId);
                if (promotion == null) {
                    throw new GraphQLError(errorName.RESOURCE_NOT_EXISTS);
                }

                const { user } = context;
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
                const account_from = await models.Account.findByPk(iban_from);
                if (!account_from) {
                    throw new GraphQLError(errorName.SENDING_IBAN_NOT_EXISTS);
                }

                // checks if the receiving account with the given iban exists
                const account_to = await models.Account.findByPk(iban_to);

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
                    iban_from: account_from.iban,
                    iban_to: account_to.iban,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                account_from.balance -= sum;
                account_to.balance += sum;

                await account_from.save();
                await account_to.save();

                return transaction;
            }
        },

        editUserDetails: {
            type: userType,
            args: {
                userInput: {
                    type: GraphQLNonNull(userInputType)
                },
                addressInput: {
                    type: GraphQLNonNull(addressInputType)
                }
            },
            resolve: async (_, { userInput, addressInput }, context) => {
                // checks if user is authenticated
                checkUserAuth(context);
                const { user } = context;

                user.firstName = userInput.firstName; 
                user.lastName = userInput.lastName;
                user.phone = userInput.phone;
                user.email = userInput.email;
                user.password = bcrypt.hashSync(userInput.password, config.SALT_ROUND);

                const address = await user.getAddress();
                address.street = addressInput.street;
                address.no = addressInput.no;
                address.city = addressInput.city;
                address.country = addressInput.country;
                await address.save();
                await user.save();

                return user;
            }
        },

        createPromotion: {
            type: promotionType,
            args: {
                promotionInput: {
                    type: GraphQLNonNull(promotionInputType) }
            },
            resolve: async (_, {promotionInput}, context) => {
                // checks if user is authenticated
                checkUserAuth(context);
                const { user } = context;

                //check if the logged user is the bank; only the bank can create a new promotion
                if(user.email != 'bank@bank.com') {
                    throw new GraphQLError(errorName.UNAUTHORIZED);
                }
                const promotion = await models.Promotion.create(promotionInput);

                return promotion;
            }
        },
        unblockAccount: {
            type: accountType,
            args: {
                iban: {
                    type: GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (_, {iban}, context) => {
                // checks if user is authenticated
                checkUserAuth(context);
                // checks if the account with the given iban exists
                
                const account = await models.Account.findByPk(iban);
                if (!account) {
                    throw new GraphQLError(errorName.RESOURCE_NOT_EXISTS);
                }

                const { user } = context;
                const accountUser = await account.getUser();

                if (accountUser.id != user.id) {
                    // account does not belong to this user
                    throw new GraphQLError(errorName.UNAUTHORIZED);
                }

                account.blocked = false;
                await account.save();
                return account;
            }
        }
    }
});

module.exports = mutationType;