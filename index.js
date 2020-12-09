const express = require('express');
const app = express();
const port = 3000;

const models = require('./models');

app.listen(port, () => {
    console.log('Server started!')
});

app.get('/hello-world', (req, res) => {
    res.send('Your banking app has started!')
});

app.get('/users/:userId', async function(req, res) {
    //get an user by id
    const userId = req.params.userId;
    const user = await models.User.findByPk(userId);
    console.log(user);
    res.send({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email
    })
});


app.get('/users/:userId/account', async function(req, res) {
    const userId = req.params.userId;
    const user = await models.User.findByPk(userId);
    const account = await user.getAccounts();

    res.send({
      last_name: user.lastName,
      account,
    });
  });


app.get('/promotions/:promotionId', async function(req, res) {
    const promotionId = req.params.promotionId;
    const promotion = await models.Promotion.findByPk(promotionId); 
    res.send({
        name: promotion.name,
        price: promotion.price,
    })
});

app.get('/users/:userId/promotions', async function(req, res) {
    //get all the promotions of a user
    const userId = req.params.userId;
    const user = await models.User.findByPk(userId);
    const promotions = await user.getPromotions();
    const countProm = await user.countPromotions();

    res.send({
        noOfPromotions: countProm,
        promotions
    });

});

app.get('/transactions/:accountId', async function(req, res) {
    // get all transactions an account sent
    const accountId = req.params.accountId;
    const transactions = await models.Transaction.findAll({
        where: {
            id_account_from: accountId
        }
    });
    console.log(transactions);
    res.send({
        a: 'success'
    })
});

app.get('/address/:userId', async function(req, res) {
    // get the address of some user 
    const userId = req.params.userId;
    const address = await models.Address.findByPk(userId);
    console.log(address);
    res.send({
        address
    })
});