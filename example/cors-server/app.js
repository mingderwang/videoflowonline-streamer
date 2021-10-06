const express = require('express');
const app = express();
app.get('/', (req, res) => {
    res.send('Welcome to CORS server 😁')
})
app.get('/cors', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', 'application/json');
    res.send({ "msg": "{a: 1}" })
    })
app.listen(8080, () => {
    console.log('listening on port 8080')
})
