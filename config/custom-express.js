require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const auth = require('../auth/autorizacao');

const app = express();
app.use(cors(), express.json(), morgan('dev'));

// middleware da conexao com o banco de dados mysql
pool = require('./pool-factory')
connectionMiddleware = require('./connection-middleware');
app.use(connectionMiddleware(pool));

// middleware de tratamento de erro
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.toString() });
});

app.get('/', (req, res) => {
    res.json({
        message: "Olá mundo! 😎👌"
    })
});

app.use('/login', require('../routes/login.js'));
app.use('/signin', require('../routes/signin.js'));

//app.use(auth.checkToken);

app.use('/pratos', require('../routes/pratos.js'));
app.use('/favoritos', require('../routes/favoritos.js'));
app.use('/ingredientes', require('../routes/ingredientes.js'));

module.exports = app;