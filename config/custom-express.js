require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const AuthMiddlewares = require('../auth');

const app = express();
app.use(cors(), express.json(), morgan('dev'));
app.use(AuthMiddlewares.checkToken);

// middleware da conexao com o banco de dados mysql
pool = require('./pool-factory')
connectionMiddleware = require('./connection-middleware');
app.use(connectionMiddleware(pool));

// middleware de log do body da requisicao
app.use((req, res, next) => {
    console.log("Body da requisicao: ");
    console.error(req.body);
    next();
});

app.use('/auth', require('../routes/auth.js'));
app.use('/usuarios', AuthMiddlewares.isLoggedIn, require('../routes/usuarios.js'));

app.use('/pratos', require('../routes/pratos.js'));
app.use('/favoritos', require('../routes/favoritos.js'));
app.use('/ingredientes', require('../routes/ingredientes.js'));

function notFound(req, res, next) {
    res.status(404);
    next(new Error('Not Found - ' + req.originalUrl));
}

function errorHandler(err, req, res, next) {
    console.log(err.stack)
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
    });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;