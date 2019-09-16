const express = require("express")

const router = express.Router()

const IngredienteDAO = require("../dao/ingredienteDAO")

/*
!   /ingredientes
*/

/*
 *  listagem de todos os ingredientes
 */
router.get("/", (req, res, next) => {
  new IngredienteDAO(req.connection)
    .list()
    .then(result => res.json(result))
    .catch(next)
})

/*
 *  Listar um ingrediente específico
 */
router.get("/:id", (req, res, next) =>
  new IngredienteDAO(req.connection)
    .get(req.params.id)
    .then(prato => res.json(prato))
    .catch(next)
)

/*
 *  Criação de um novo ingrediente
 */
router.post("/", (req, res, next) => {
  const { nome } = req.body

  new IngredienteDAO(req.connection)
    .create(nome)
    .then(result => res.json(result))
    .catch(next)
})

module.exports = router
