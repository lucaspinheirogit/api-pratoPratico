const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');

const LoginDAO = require('../dao/loginDAO');

/*
!   /auth
*/

/*
*  Logar checando se o email e a senha estão corretos
*/

router.post('/login', (req, res, next) => {
  const { email, senha } = req.body;

  new LoginDAO(req.connection)
    .login(email, senha)
    .then((result) => {
      result.auth
        ? res.status(200).json({
          token: result.token,
          username: result.username,
          role: result.role,
        })
        : res.status(401).json(result.mensagem);
    })
    .catch(next);
});

/*
*  Cadastrar checando se o email não está cadastrado já
*/
router.post('/signup', (req, res, next) => {
  const {
    nome, img, imgNome, email, senha,
  } = req.body;

  new LoginDAO(req.connection)
    .signup(nome, img, imgNome, email, senha)
    .then((result) => {
      result.auth
        ? new LoginDAO(req.connection)
          .login(email, senha)
          .then((result) => {
            result.auth ? res.status(200).json({
              token: result.token,
              username: result.username,
              role: result.role,
            }) : res.status(401).json(result.mensagem);
          })
          .catch(next)
        : res.status(401).json(result.mensagem);
    })
    .catch(next);
});

/*
*  Renovar o token
*/

router.get('/renew', (req, res) => {
  const token = req.get('authorization');

  if (token !== undefined) {
    if (token.length > 0) {
      jwt.verify(token, process.env.SECRET, (error, user) => {
        if (error) {
          res.status(401).end();
        } else {
          console.log(user);

          const payload = {
            id: user.id,
            username: user.username,
            role: user.role,
          };

          const newToken = jwt.sign(payload, process.env.SECRET, {
            expiresIn: '7d', // expira em 7 dias
          });

          res.status(200);
          res.json({ token: newToken });
        }
      });
    } else {
      res.status(401).end();
    }
  } else {
    res.status(401).end();
  }
});


module.exports = router;
