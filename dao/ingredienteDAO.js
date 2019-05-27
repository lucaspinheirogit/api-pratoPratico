const mysql = require('mysql');

class ingredienteDAO {

    constructor(connection) {
        this._connection = connection;
    }

    create(pratoId, nome, quantidade, unidadeMedida) {
        return new Promise((resolve, reject) => {

            //checa se o ingrediente já existe, se não existir ainda, cria-lo
            this.jaExiste(pratoId, nome, quantidade, unidadeMedida)
                .then(resultado => {
                    if (resultado) {
                        resolve()
                    } else {

                        let sql = "INSERT INTO ingrediente (Nome) VALUES (?)";
                        let sqlInsert = [nome];
                        sql = mysql.format(sql, sqlInsert);

                        this._connection.query(sql, (err, result, fields) => {
                            if (err) return reject(err);

                            let sql = "INSERT INTO prato_ingrediente (prato_id, ingrediente_id, quantidade, unidademedida) VALUES (?, ?, ?, ?)";
                            let sqlInsert = [pratoId, result.insertId, quantidade, unidadeMedida];
                            sql = mysql.format(sql, sqlInsert);

                            this._connection.query(sql, (err, result, fields) => {
                                if (err) return reject(err);
                                resolve(result.insertId)
                            })
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

    jaExiste(pratoId, nome, quantidade, unidadeMedida) {
        return new Promise((resolve, reject) => {

            let sql = "SELECT * FROM ingrediente WHERE nome=?";
            let sqlInsert = [nome];
            sql = mysql.format(sql, sqlInsert);

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);

                if (result.length > 0) {
                    
                    let sql = "INSERT INTO prato_ingrediente (prato_id, ingrediente_id, quantidade, unidademedida) VALUES (?, ?, ?, ?)";
                    let sqlInsert = [pratoId, result[0].Id, quantidade, unidadeMedida];
                    sql = mysql.format(sql, sqlInsert);

                    this._connection.query(sql, (err, result, fields) => {
                        if (err) return reject(err);
                        resolve(true);
                    })

                } else {
                    resolve(result.length > 0);
                }

            })
        })
    }

}

module.exports = ingredienteDAO;
