const express = require('express');
const router = express.Router();
const AuthMiddlewares = require('../auth');
const helper = require('../helpers')
const queries = require('../config/queries');

const pratoDAO = require('../dao/pratoDAO');
const ingredienteDAO = require('../dao/ingredienteDAO');


/*  
!   /pratos
*/

/*  
*  Criação de um novo prato
*/
router.post("/", AuthMiddlewares.isLoggedIn, (req, res, next) => {
    let { nome, descricao, modo, tempo, dificuldade, foto, fotoNome, publica, ingredientes } = req.body;
    let dono = req.user.id;

    let validouDificuldade = helper.validaDificuldade(dificuldade);
    let validouIngredientes = helper.validaIngredientes(ingredientes);

    if (!validouDificuldade || !validouIngredientes) {
        res.status(400).json({ "message": "Dados incorretos" });
    } else {


        new pratoDAO(req.connection)
            .create(nome, descricao, modo, tempo, dificuldade, dono, foto, fotoNome, publica)
            .then(pratoId => {

                ingredientes.forEach(ingrediente => {
                    let { nome, quantidade, unidadeMedida } = ingrediente;

                    new ingredienteDAO(req.connection)
                        .create(pratoId, nome, quantidade, unidadeMedida)
                        .then(result => { })
                        .catch(next)
                });

            })
            .catch(next)

        res.json({ "message": "Prato cadastrado com sucesso" });


    }
});

/*
*  Atualizar um prato
*/
router.put("/:id/update", AuthMiddlewares.isLoggedIn, (req, res, next) => {
    let { nome, descricao, modo, tempo, dificuldade, foto, fotoNome, publica } = req.body;
    let dono = req.user.id;

    let validouDificuldade = helper.validaDificuldade(dificuldade);

    if (!validouDificuldade) {
        res.status(400).json({ "message": "Dados incorretos" });
    } else {

        new pratoDAO(req.connection)
            .update(req.params.id, nome, descricao, modo, tempo, dificuldade, dono, foto, fotoNome, publica)
            .then(result => res.json(result))
            .catch(next)
    }
});

/*  
*  Deletar um prato
*/
router.delete("/:id/delete", AuthMiddlewares.isLoggedIn, (req, res, next) => {
    new pratoDAO(req.connection)
        .delete(req.params.id, req.user.id)
        .then(response => res.json(response))
        .catch(next)
});

/*  
*  Deletar um ingrediente de um prato
*/
router.delete("/:id/ingredient/:ingrediente_id/delete", AuthMiddlewares.isLoggedIn, (req, res, next) => {
    let dono = req.user.id;
    let { id, ingrediente_id } = req.params;

    new pratoDAO(req.connection)
        .deleteIngredient(id, ingrediente_id, dono)
        .then(result => res.json(result))
        .catch(next)
});

/*  
*  Adicionar um ingrediente a um prato
*/
router.post("/:id/ingredient", AuthMiddlewares.isLoggedIn, (req, res, next) => {
    let dono = req.user.id;
    let { id } = req.params;
    let { nome, quantidade, unidadeMedida } = req.body;

    let ingredientes = [{ nome, quantidade, unidadeMedida }]
    let validouIngredientes = helper.validaIngredientes(ingredientes);

    if (!validouIngredientes) {
        res.status(400).json({ "message": "Dados incorretos" });
    } else {
        new ingredienteDAO(req.connection)
            .create(id, nome, quantidade, unidadeMedida)
            .then(result => res.json(result))
            .catch(next)
    }
});

/*  
*  Tornar um prato privado, ou publico caso esteja privado
*/
router.delete("/:id/private", AuthMiddlewares.isLoggedIn, (req, res, next) => {
    new pratoDAO(req.connection)
        .private(req.params.id, req.user.id)
        .then(response => res.json(response))
        .catch(next)
});

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
            res.json({
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
*  Listar um prato específico
*/
router.get("/detalhe/:id", (req, res, next) => {
    let { id } = req.params;
    new pratoDAO(req.connection)
        .get(id)
        .then(prato => res.json(prato))
        .catch(next)
});

/*  
*  Listar os pratos de um usuário específico
*/
router.get("/usuario/:id", (req, res, next) => {
    let { id } = req.params;
    new pratoDAO(req.connection)
        .listFromUser(id)
        .then(prato => res.json(prato))
        .catch(next)
});

/*  
*  Listar um prato aleatoriamente escolhido
*/
router.get("/random", (req, res, next) => {
    new pratoDAO(req.connection)
        .random()
        .then(prato => res.json(prato))
        .catch(next)
});

/*  
*  Buscar pratos
*/
router.post("/search", (req, res, next) => {
    const { nome, tempo, dificuldade, ingredientes } = req.body;

    queries.search({ nome, tempo: parseInt(tempo), dificuldade, ingredientes }).then(pratos => res.json(pratos))
})




module.exports = router;