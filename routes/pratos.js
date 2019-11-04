const express = require("express")

const router = express.Router()
const AuthMiddlewares = require("../auth")
const helper = require("../helpers")
const queries = require("../config/queries")

const PratoDAO = require("../dao/pratoDAO")
const IngredienteDAO = require("../dao/ingredienteDAO")

const multer = require("multer")
const multerConfig = require("../config/multer")

/*
!   /pratos
*/

/*
 *  Criação de um novo prato
 */
router.post(
  "/",
  multer(multerConfig).single("fileData"),
  AuthMiddlewares.isLoggedIn,
  (req, res, next) => {
    const { nome, descricao, modo, tempo, dificuldade, publica } = req.body
    let { ingredientes = [] } = req.body
    const dono = req.user.id

    ingredientes = JSON.parse(ingredientes)

    const validouDificuldade = helper.validaDificuldade(dificuldade)
    const validouIngredientes = helper.validaIngredientes(ingredientes)

    if (!validouDificuldade || !validouIngredientes) {
      res.status(400).json({ message: "Dados incorretos" })
    } else {
      new PratoDAO(req.connection)
        .create(
          nome,
          descricao,
          modo,
          tempo,
          dificuldade,
          dono,
          req.file,
          publica
        )
        .then(pratoId => {
          ingredientes.forEach(ingrediente => {
            const { nome, quantidade, unidadeMedida } = ingrediente

            new IngredienteDAO(req.connection)
              .create(pratoId, nome, quantidade, unidadeMedida)
              .then(() => {})
              .catch(next)
          })
        })
        .catch(next)

      res.json({ message: "Prato cadastrado com sucesso" })
    }
  }
)

/*
 *  Atualizar um prato
 */
router.put(
  "/:id/update",
  multer(multerConfig).single("fileData"),
  AuthMiddlewares.isLoggedIn,
  (req, res, next) => {
    const { nome, descricao, modo, tempo, dificuldade, publica } = req.body
    const dono = req.user.id

    const validouDificuldade = helper.validaDificuldade(dificuldade)

    if (!validouDificuldade) {
      res.status(400).json({ message: "Dados incorretos" })
    } else {
      new PratoDAO(req.connection)
        .update(
          req.params.id,
          nome,
          descricao,
          modo,
          tempo,
          dificuldade,
          dono,
          req.file,
          publica
        )
        .then(result => res.json(result))
        .catch(next)
    }
  }
)

/*
 *  Deletar um prato
 */
router.delete("/:id/delete", AuthMiddlewares.isLoggedIn, (req, res, next) => {
  new PratoDAO(req.connection)
    .delete(req.params.id, req.user.id)
    .then(response => res.json(response))
    .catch(next)
})

/*
 *  Deletar um ingrediente de um prato
 */
router.delete(
  "/:id/ingredient/:ingrediente_id/delete",
  AuthMiddlewares.isLoggedIn,
  (req, res, next) => {
    const dono = req.user.id
    const { id, ingrediente_id } = req.params

    new PratoDAO(req.connection)
      .deleteIngredient(id, ingrediente_id, dono)
      .then(result => res.json(result))
      .catch(next)
  }
)

/*
 *  Adicionar um ingrediente a um prato
 */
router.post("/:id/ingredient", AuthMiddlewares.isLoggedIn, (req, res, next) => {
  const { id } = req.params
  const { nome, quantidade, unidadeMedida } = req.body

  const ingredientes = [{ nome, quantidade, unidadeMedida }]
  const validouIngredientes = helper.validaIngredientes(ingredientes)

  if (!validouIngredientes) {
    res.status(400).json({ message: "Dados incorretos" })
  } else {
    new IngredienteDAO(req.connection)
      .create(id, nome, quantidade, unidadeMedida)
      .then(result => res.json(result))
      .catch(next)
  }
})

/*
 *  Tornar um prato privado, ou publico caso esteja privado
 */
router.delete("/:id/private", AuthMiddlewares.isLoggedIn, (req, res, next) => {
  new PratoDAO(req.connection)
    .private(req.params.id, req.user.id)
    .then(response => res.json(response))
    .catch(next)
})

/*
 *  listagem de todos os pratos com paginacao opcional (Offset e limit)
 */
router.get("/", (req, res, next) => {
  // Definir valores de paginacao default caso nenhum valor for passado na query da request
  const offset = Object.is(req.query.offset, undefined) ? 0 : req.query.offset
  const limit = Object.is(req.query.limit, undefined) ? 9999 : req.query.limit

  new PratoDAO(req.connection)
    .list(offset, limit)
    .then(pratos => {
      const hasMore = pratos.total > parseInt(offset, 10) + parseInt(limit, 10)
      res.json({
        pagination: {
          offset,
          limit,
          total: pratos.total,
          hasMore
        },
        pratos: pratos.pratos
      })
    })
    .catch(next)
})

/*
 *  Listar um prato específico
 */
router.get("/detalhe/:id", (req, res, next) => {
  const { id } = req.params
  new PratoDAO(req.connection)
    .get(id)
    .then(prato => res.json(prato))
    .catch(next)
})

/*
 *  Listar os pratos de um usuário específico
 */
router.get("/usuario/:id", (req, res, next) => {
  const { id } = req.params
  new PratoDAO(req.connection)
    .listFromUser(id)
    .then(prato => res.json(prato))
    .catch(next)
})

/*
 *  Listar um prato aleatoriamente escolhido
 */
router.get("/random", (req, res, next) => {
  new PratoDAO(req.connection)
    .random()
    .then(prato => res.json(prato))
    .catch(next)
})

/*
 *  Buscar pratos
 */
router.post("/search", (req, res) => {
  const { nome, tempo, dificuldade, ingredientes } = req.body

  const offset = Object.is(req.body.offset, undefined)
    ? 0
    : parseInt(req.body.offset, 10)
  const limit = Object.is(req.body.limit, undefined)
    ? 5
    : parseInt(req.body.limit, 10)

  queries
    .search({
      nome,
      tempo: parseInt(tempo, 10),
      dificuldade,
      ingredientes,
      offset: 0,
      limit: 100
    })
    .then(pratos => res.json(pratos))
})

module.exports = router
