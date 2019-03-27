const express = require('express');
const router = express.Router();

const loginDAO = require('../dao/loginDAO');

/*  
!   /signin
*/

/*  
*  Cadastrar checando se o email não está cadastrado já
*/
router.post('/', (req, res, next) => {
    let { nome, email, senha } = req.body;
    new loginDAO(req.connection)
        .signin(nome, email, senha)
        .then(result => {
            result.auth ? res.redirect(307, '/login') : res.status(401).send(result.mensagem)
        })
        .catch(next)
    });

module.exports = router;