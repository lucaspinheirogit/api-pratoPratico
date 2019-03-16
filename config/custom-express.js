require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const auth = require('../auth/autorizacao');

const app = express();
app.use(cors(), express.json(), morgan());

pool = require('./pool-factory')
connectionMiddleware = require('./connection-middleware');
app.use(connectionMiddleware(pool));

// middleware de tratamento de erro
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.toString() });
});

const login = require('../routes/login.js');
app.use('/login', login);

const signin = require('../routes/signin.js');
app.use('/signin', signin);

//app.use(auth.checkToken);

const pratos = require('../routes/pratos.js');
app.use('/pratos', pratos);

const ingredientes = require('../routes/ingredientes.js');
app.use('/ingredientes', ingredientes);

app.get('/', (req, res) => {
    res.json({
        message: "Ola mundo! 😎👌"
    })
});


module.exports = app;