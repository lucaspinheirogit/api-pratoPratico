const express = require('express');
const router = express.Router();
const dificuldadeEnum = require('../enums/dificuldade');

const pratoDAO = require('../dao/pratoDAO');
const ingredienteDAO = require('../dao/ingredienteDAO');

/*  
!   /pratos
*/

/*  
*  listagem de todos os pratos com paginacao opcional (Offset e limit)
*/
router.get("/", (req, res, next) => {
    //Definir valores de paginacao default caso nenhum valor for passado na query da request
    let offset = Object.is(req.query.offset, undefined) ? 0 : req.query.offset;
    let limit = Object.is(req.query.limit, undefined) ? 9999 : req.query.limit;

    new pratoDAO(req.connection)
        .list(offset, limit)
        .then(pratos => {
            let hasMore = pratos.total > (parseInt(offset) + parseInt(limit));
            res.send({
                "pagination": {
                    offset,
                    limit,
                    "total": pratos.total,
                    "hasMore": hasMore,
                },
                "pratos": pratos.pratos
            })
        })
        .catch(next)
});

/*  
*  Criação de um novo prato
*/
router.post("/", (req, res, next) => {
    let { nome, descricao, modo, tempo, dificuldade, foto, publica, ingredientes } = req.body;
    dificuldade = dificuldadeEnum.MEDIO;
    let dono = req.user.id;

    let ingredientesId = [];
    let pratoId = null;

    new pratoDAO(req.connection)
        .create(nome, descricao, modo, tempo, dificuldade, dono, foto, publica)
        .then(result => pratoId = result)
        .catch(next)

    ingredientes.forEach(ingrediente => {
        new ingredienteDAO(req.connection)
            .create(ingrediente.nome)
            .then(result => {

                ingredientesId.push(result)
                // new prato_ingredienteDAO(req.connection).create(result, pratoId)

            })
            .catch(next)
    });

    console.log("pratoId: " + pratoId);
    console.log("ingredientesId: ");
    console.log(ingredientesId);

    res.send({ "message": "Prato cadastrado com sucesso" });
});


/*  
*  Listar um prato específico
*/
router.get("/detalhe/:id", (req, res, next) =>
    new pratoDAO(req.connection)
        .get(req.params.id)
        .then(prato => res.send(prato))
        .catch(next)
);

/*  
*  Listar os pratos de um usuário específico
*/
router.get("/usuario/:id", (req, res, next) =>
    new pratoDAO(req.connection)
        .listFromUser(req.params.id)
        .then(prato => res.send(prato))
        .catch(next)
);

/*  
*  Listar um prato aleatoriamente escolhido
*/
router.get("/random", (req, res, next) =>
    new pratoDAO(req.connection)
        .random()
        .then(prato => res.send(prato))
        .catch(next)
);




module.exports = router;