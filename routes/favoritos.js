const express = require('express');
const router = express.Router();

const pratoDAO = require('../dao/pratoDAO');

/*  
!   /favoritos
*/

/*  
*  listagem dos favoritos de um usuário
*/
router.get("/listar/:id", (req, res, next) => {

    new pratoDAO(req.connection)
        .listFavoritesFromUser(req.params.id)
        .then(result => res.json(result))
        .catch(next)
});

/*  
*  array de IDS dos pratos favoritos de um usuário
!  Vai ser utilizado pra saber se tal prato está favoritado ou nao, 
!  basta checar se a key (id) do prato está dentro desse array de favoritos do usuário
*/
router.get("/:id", (req, res, next) => {

    new pratoDAO(req.connection)
        .listFavoritesArrayFromUser(req.params.id)
        .then(result => res.json(result))
        .catch(next)
});

/*  
*  Favoritar/desfavoritar um prato
*/
router.post("/", (req, res, next) => {
    let { prato_id } = req.body;

    console.log("favoritando prato");
    
    
    new pratoDAO(req.connection)
    .favorite(prato_id, req.user.id)
    .then(result => res.json(result))
    .catch(next)
});


module.exports = router;