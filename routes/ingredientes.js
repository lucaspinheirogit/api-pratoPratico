const express = require('express');
const router = express.Router();

const ingredienteDAO = require('../dao/ingredienteDAO');

/*  
!   /ingredientes
*/

/*  
*  listagem de todos os ingredientes
*/
router.get("/", (req, res, next) => {

    new ingredienteDAO(req.connection)
        .list()
        .then(result => res.json(result))
        .catch(next)
});

/*  
*  Listar um ingrediente específico
*/
router.get("/:id", (req, res, next) =>
    new ingredienteDAO(req.connection)
        .get(req.params.id)
        .then(prato => res.json(prato))
        .catch(next)
);

/*  
*  Criação de um novo ingrediente
*/
router.post("/", (req, res, next) => {
    let { nome } = req.body;

    new ingredienteDAO(req.connection)
        .create(nome)
        .then(result => res.json(result))
        .catch(next)
});



module.exports = router;