const jwt = require('jsonwebtoken');

module.exports = {
  checkToken(req, res, next) {
    const token = req.get('authorization');
    if (token !== undefined) {
      if (token.length > 0) {
        jwt.verify(token, process.env.SECRET, (error, user) => {
          if (error) throw error;
          req.user = user;
          next();
        });
      } else {
        next();
      }
    } else {
      next();
    }
  },
  isLoggedIn(req, res, next) {
    if (req.user === undefined) {
      res.status(401);
      next(new Error('Unauthorized'));
    } else {
      next();
    }
  },

  isAdmin(req, res, next) {
    if (req.user === undefined) {
      res.status(401); next(new Error('Não autorizado! faça login para continuar...'));
    } else if (req.user.role !== 'admin') {
      res.status(401); next(new Error('Não autorizado!'));
    } else {
      next();
    }
  },
};
