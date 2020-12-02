const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log('Server started!')
});

app.get('/hello-world', (req, res) => {
    res.send('Your banking app has started!')
});