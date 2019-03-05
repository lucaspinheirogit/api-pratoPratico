var jwt = require('jsonwebtoken');

class loginDAO {


    constructor(connection) {
        this._connection = connection;
    }

    login(email, senha) {
        return new Promise((resolve, reject) => {

            var sql = `SELECT * FROM usuarios WHERE email='${email}' and senha='${senha}' `;

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);

                if (result.length > 0) {

                    let nome = result[0].nome;
                    let id = result[0].id;

                    const payload = {
                        id: id,
                        username: nome
                    }

                    console.log("SECRET: " + process.env.SECRET);
                    
                    var token = jwt.sign(payload, process.env.SECRET, {
                        expiresIn: 3600 // expira em 15 minutos
                    });

                    resolve({ auth: true, mensagem: 'Login Válido!', token: token });

                } else {
                    resolve({ auth: false, mensagem: 'Login Inválido!' });
                }

            })
        });
    }

    signin(nome, email, senha) {
        return new Promise((resolve, reject) => {

            let sql = `SELECT * FROM usuarios WHERE email='${email}'`;

            this._connection.query(sql, function (err, result, fields) {
                if (err) return reject(err);

                if (result.length > 0) {
                    resolve({ auth: false, mensagem: 'Já existe um usuário cadastrado com esse email!' });
                } else {

                    let sql = `INSERT INTO usuarios (nome, email, senha) VALUES ('${nome}', '${email}', '${senha}')`;
                    this._connection.query(sql, function (err, result) {
                        if (err) return reject(err);
                        resolve({ auth: true, email, senha });
                    });
                }
            });
        });
    }
}

module.exports = loginDAO;

