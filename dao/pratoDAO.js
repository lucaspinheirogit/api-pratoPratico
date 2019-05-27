const mysql = require('mysql');
const moment = require('moment');

class pratosDAO {

    constructor(connection) {
        this._connection = connection;
    }

    create(nome, desc, modo, tempo, dif, dono, foto, publica) {
        return new Promise((resolve, reject) => {

            let dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss');

            let sql = "INSERT INTO prato (Nome, Descricao, ModoPreparo, TempoPreparo, Dificuldade, Dono, Foto, Public, DataCriacao, Visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            let sqlInsert = [nome, desc, modo, tempo, dif, dono, foto, publica, dataCriacao, true];
            sql = mysql.format(sql, sqlInsert);

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result.insertId);
            })
        });
    }

    update(id, nome, desc, modo, tempo, dif, dono, foto, publica) {
        return new Promise((resolve, reject) => {

            let dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss');

            let sql = "UPDATE prato SET nome=?, descricao=?, modopreparo=?, tempopreparo=?, dificuldade=?, dono=?, foto=?, public=?, datacriacao=? where id=?";
            let sqlInsert = [nome, desc, modo, tempo, dif, dono, foto, publica, dataCriacao, id];
            sql = mysql.format(sql, sqlInsert);

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve({ message: "Prato atualizado com sucesso!" });
            })
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            let dataAtualizacao = moment().format('YYYY-MM-DD HH:mm:ss');

            let sql = "UPDATE prato SET visible=false, updated_at=? where id = ?"
            let sqlInsert = [dataAtualizacao, id];
            sql = mysql.format(sql, sqlInsert);

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve({ message: "Prato excluído com sucesso!" });
            })
        });
    }

    list(offset, limit) {
        return new Promise((resolve, reject) => {
            let resultado = {
                "pratos": '',
                "total": 0
            }

            let sql = "SELECT * FROM prato WHERE public = '1' ORDER BY id desc LIMIT ?, ?";
            let sqlInsert = [offset, limit];
            sql = mysql.format(sql, sqlInsert);

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resultado.pratos = result;

                let sql2 = "SELECT COUNT(*) FROM prato where public = '1'";

                this._connection.query(sql2, (err, result, fields) => {
                    if (err) return reject(err);
                    resultado.total = result[0]['COUNT(*)'];
                    resolve(resultado);
                })
            })
        });
    }

    listFromUser(id) {
        return new Promise((resolve, reject) => {

            let sql = `SELECT * FROM prato WHERE dono = ? and public = '1'`;
            let sqlInsert = [id];
            sql = mysql.format(sql, sqlInsert);

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    }

    listFavoritesFromUser(id) {
        return new Promise((resolve, reject) => {

            let sql = "SELECT * FROM favorito INNER JOIN prato ON favorito.prato_id = prato.id WHERE usuario_id = ?";
            let sqlInsert = [id];
            sql = mysql.format(sql, sqlInsert);

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    }

    listFavoritesArrayFromUser(id) {
        return new Promise((resolve, reject) => {

            let sql = "SELECT prato_id FROM favorito INNER JOIN prato ON favorito.prato_id = prato.id WHERE usuario_id = ?";
            let sqlInsert = [id];
            sql = mysql.format(sql, sqlInsert);

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    }

    favorite(prato_id, usuario_id) {
        return new Promise((resolve, reject) => {

            this.FavoritoJaExiste(prato_id, usuario_id)
                .then(resultado => {
                    if (resultado) {

                        let sql = "DELETE FROM favorito WHERE prato_id=? AND usuario_id=?";
                        let sqlInsert = [prato_id, usuario_id];
                        sql = mysql.format(sql, sqlInsert);

                        this._connection.query(sql, (err, result, fields) => {
                            if (err) return reject(err);
                            resolve("desfavoritado com sucesso!");
                        })
                    } else {

                        let sql = "INSERT INTO favorito (Prato_id, Usuario_id) VALUES (?,?)";
                        let sqlInsert = [prato_id, usuario_id];
                        sql = mysql.format(sql, sqlInsert);

                        this._connection.query(sql, (err, result, fields) => {
                            if (err) return reject(err);
                            resolve(result.insertId);
                        })
                    }
                })
        });
    }

    get(id) {
        return new Promise((resolve, reject) => {

            let sql = "SELECT * FROM prato WHERE id=?";
            let sqlInsert = [id];
            sql = mysql.format(sql, sqlInsert);

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    }

    random() {
        return new Promise((resolve, reject) => {

            let sql = "SELECT * FROM prato WHERE public = '1' ORDER BY RAND() LIMIT 1";

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    }

    FavoritoJaExiste(prato_id, usuario_id) {
        return new Promise((resolve, reject) => {

            let sql = "SELECT * FROM favorito WHERE prato_id=? AND usuario_id=?";
            let sqlInsert = [prato_id, usuario_id];
            sql = mysql.format(sql, sqlInsert);

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result.length > 0);
            })
        })
    }

}

module.exports = pratosDAO;
