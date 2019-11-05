const express = require("express")
const router = express.Router()
const AuthMiddlewares = require("../auth")
const UsuarioDAO = require("../dao/usuarioDAO")

const multer = require("multer")
const multerConfig = require("../config/multer")

/*
!   /usuarios
*/

/*
!ADMIN
*  listagem dos usuários
*/
router.get("/all", AuthMiddlewares.isAdmin, (req, res, next) => {
  new UsuarioDAO(req.connection)
    .list()
    .then(result => res.json(result))
    .catch(next)
})

/*
 *  listagem dos dados de um usuário
 */
router.get("/", AuthMiddlewares.isLoggedIn, (req, res, next) => {
  new UsuarioDAO(req.connection)
    .get(req.user.id)
    .then(result => res.json(result))
    .catch(next)
})

/*
 *  alteração dos dados do usuário
 */
router.put(
  "/",
  multer(multerConfig).single("fileData"),
  AuthMiddlewares.isLoggedIn,
  async (req, res, next) => {
    const { nome, senha } = req.body
    const img = req.file || null

    new UsuarioDAO(req.connection)
      .update(req.user.id, nome, senha, img)
      .then(result => res.json(result))
      .catch(next)
  }
)

module.exports = router
