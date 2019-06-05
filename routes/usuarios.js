const express = require('express');
const router = express.Router();
const AuthMiddlewares = require('../auth');

const usuarioDAO = require('../dao/usuarioDAO');

/*  
!   /usuarios
*/

/*  
!ADMIN
*  listagem dos usuários
*/
router.get("/all", AuthMiddlewares.isAdmin, (req, res, next) => {
    new usuarioDAO(req.connection)
        .list()
        .then(result => res.json(result))
        .catch(next)
});

/*  
*  listagem dos dados de um usuário
*/
router.get("/", AuthMiddlewares.isLoggedIn, (req, res, next) => {
    new usuarioDAO(req.connection)
        .get(req.user.id)
        .then(result => res.json(result))
        .catch(next)
});

/*  
*  alteração dos dados do usuário
*/
router.put("/", AuthMiddlewares.isLoggedIn, (req, res, next) => {

    let { nome, senha, img, imgNome } = req.body;

    new usuarioDAO(req.connection)
        .update(req.user.id, nome, senha, img, imgNome)
        .then(result => res.json(result))
        .catch(next)
});

module.exports = router;