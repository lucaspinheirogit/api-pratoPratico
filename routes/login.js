const express = require('express');
const router = express.Router();

const loginDAO = require('../dao/loginDAO');

/*  
!   /login
*/


/*  
*  Logar checando se o email/senha estão corretos
*/

router.post('/', (req, res, next) => {

    console.log(req.body.email);
    console.log(req.body.senha);

    new loginDAO(req.connection)
        .login(req.body.email, req.body.senha)
        .then(result => {
            console.log(result);
            
            result.auth ? res.status(200).json(result.token) : res.status(401).send(result.mensagem)
        }
        )
        .catch(next)
}
);




module.exports = router;