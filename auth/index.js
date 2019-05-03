const jwt = require('jsonwebtoken');

module.exports = {
    checkToken: function (req, res, next) {
        var token = req.get('authorization');
        if (token !== undefined) {
            if (token.length > 0) {
                jwt.verify(token, process.env.SECRET, (error, user) => {
                    if (error) throw error;
                    req.user = user;
                    console.log("AUTORIZADO");
                    next();
                });
            } else {
                next();
            }
        } else {
            next();
        }
    },
    isLoggedIn: function (req, res, next) {
        console.log(req.user === undefined);

        if (req.user === undefined) {
            res.status(401); next(new Error('Unauthorized'));
        } else {
            next()
        }

    }
}