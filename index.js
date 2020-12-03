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