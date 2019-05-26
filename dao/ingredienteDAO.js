const mysql = require('mysql');

class ingredienteDAO {

    constructor(connection) {
        this._connection = connection;
    }

    create(nome) {
        return new Promise((resolve, reject) => {

            //checa se o ingrediente já existe, se não existir ainda, cria-lo
            this.jaExiste(nome)
                .then(resultado => {
                    if (resultado) {
                        resolve()
                    } else {
                        
                        let sql = "INSERT INTO ingrediente (Nome) VALUES (?)";
                        let sqlInsert = [nome];
                        sql = mysql.format(sql, sqlInsert);

                        this._connection.query(sql, (err, result, fields) => {
                            if (err) return reject(err);
                            resolve(result.insertId);
                        })
                    }
                })
        });
    }

    list() {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM ingrediente`;
            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    }

    get(id) {
        return new Promise((resolve, reject) => {

            let sql = "SELECT * FROM ingrediente WHERE id=?";
            let sqlInsert = [id];
            sql = mysql.format(sql, sqlInsert);

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    }

    jaExiste(nome) {
        return new Promise((resolve, reject) => {

            let sql = "SELECT * FROM ingrediente WHERE nome=?";
            let sqlInsert = [nome];
            sql = mysql.format(sql, sqlInsert);

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result.length > 0);
            })
        })
    }

}

module.exports = ingredienteDAO;
