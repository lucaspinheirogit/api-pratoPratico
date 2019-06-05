const express = require('express');
const router = express.Router();

const helper = require('../helpers');
const loginDAO = require('../dao/loginDAO');

/*  
!   /auth
*/

/*  
*  Logar checando se o email/senha estão corretos
*/

router.post('/login', (req, res, next) => {
    let { email, senha } = req.body;

    new loginDAO(req.connection)
        .login(email, senha)
        .then(result => {
            result.auth ?
                res.status(200).json({
                    token: result.token,
                    username: result.username,
                    role: result.role,
                }) :
                res.status(401).json(result.mensagem)
        })
        .catch(next)
});

/*  
*  Cadastrar checando se o email não está cadastrado já
*/
router.post('/signup', (req, res, next) => {
    let { nome, img, imgNome, email, senha } = req.body;

    new loginDAO(req.connection)
        .signup(nome, img, imgNome, email, senha)
        .then(result => {
            result.auth ?
                new loginDAO(req.connection)
                    .login(email, senha)
                    .then(result => {
                        result.auth ? res.status(200).json({
                            token: result.token,
                            username: result.username,
                            role: result.role,
                        }) : res.status(401).json(result.mensagem)
                    })
                    .catch(next) :
                res.status(401).json(result.mensagem)
        })
        .catch(next)
});




module.exports = router;