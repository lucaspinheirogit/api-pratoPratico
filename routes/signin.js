const express = require('express');
const router = express.Router();

const loginDAO = require('../dao/loginDAO');

/*  
!   /signin
*/


/*  
*  Cadastrar checando se o email não está cadastrado já
*/
router.post('/', (req, res, next) =>
    new loginDAO(req.connection)
        .signin(req.body.nome, req.body.email, req.body.senha)
        .then(result => {
            result.auth ? res.redirect(307, '/login') : res.status(401).send(result.mensagem)
        })
        .catch(next)
);

module.exports = router;