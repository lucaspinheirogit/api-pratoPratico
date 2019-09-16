const express = require("express")

const router = express.Router()
const AuthMiddlewares = require("../auth")

const PratoDAO = require("../dao/pratoDAO")

/*
!   /favoritos
*/

/*
*  listagem dos pratos favoritos de um usuário
router.get('/', AuthMiddlewares.isLoggedIn, (req, res, next) => {
  new PratoDAO(req.connection)
    .listFavoritesFromUser(req.user.id)
    .then(result => res.json(result))
    .catch(next);
});
*/

/*
 *  listagem dos pratos favoritos de um usuário com paginacao opcional (Offset e limit)
 */
router.get("/", AuthMiddlewares.isLoggedIn, (req, res, next) => {
  // Definir valores de paginacao default caso nenhum valor for passado na query da request
  const offset = Object.is(req.query.offset, undefined) ? 0 : req.query.offset
  const limit = Object.is(req.query.limit, undefined) ? 9999 : req.query.limit

  new PratoDAO(req.connection)
    .listFavoritesFromUser(req.user.id, offset, limit)
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
*  array de IDS dos pratos favoritos de um usuário
!  Vai ser utilizado pra saber se tal prato está favoritado ou nao,
!  basta checar se a key (id) do prato está dentro desse array de favoritos do usuário
*/
router.get("/array", AuthMiddlewares.isLoggedIn, (req, res, next) => {
  new PratoDAO(req.connection)
    .listFavoritesArrayFromUser(req.user.id)
    .then(result => res.json(result))
    .catch(next)
})

/*
 *  Favoritar/desfavoritar um prato
 */
router.get("/:id", AuthMiddlewares.isLoggedIn, (req, res, next) => {
  new PratoDAO(req.connection)
    .favorite(req.params.id, req.user.id)
    .then(result => res.json(result))
    .catch(next)
})

module.exports = router
