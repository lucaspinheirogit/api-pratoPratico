const express = require('express');
const router = express.Router();

const usuarioDAO = require('../dao/usuarioDAO');

/*  
!   /usuarios
*/

/*  
*  listagem dos dados de um usuário
*/
router.get("/", (req, res, next) => {
    new usuarioDAO(req.connection)
        .get(req.user.id)
        .then(result => res.json(result))
        .catch(next)
});

/*  
*  alteração dos dados do usuário
*/
router.put("/", (req, res, next) => {

    let { nome, senha, img } = req.body;

    new usuarioDAO(req.connection)
        .update(req.user.id, nome, senha, img)
        .then(result => res.json(result))
        .catch(next)
});

module.exports = router;