const mysql = require('mysql');
const moment = require('moment');
const bcrypt = require('bcrypt');
const helper = require('../helpers');

class usuariosDAO {

    constructor(connection) {
        this._connection = connection;
    }

    list() {
        return new Promise((resolve, reject) => {

            let sql = "SELECT * FROM usuario";

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    }

    get(id) {
        return new Promise((resolve, reject) => {

            let sql = "SELECT * FROM usuario WHERE id=?";
            let sqlInsert = [id];
            sql = mysql.format(sql, sqlInsert);

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result[0]);
            })
        });
    }

    update(id, nome, senha, img, imgNome) {
        return new Promise((resolve, reject) => {

            let dataAtualizacao = moment().format('YYYY-MM-DD HH:mm:ss');
            let hash = bcrypt.hashSync(senha, 3);

            if (img) {
                img = helper.base64ImageToBlob(img);
                helper.uploadImageGetUrl(img, imgNome, nome).then((url) => {
                    let sql = "UPDATE usuario SET nome=?, senha=?, img=?, dataAtualizacao=? where id=?";
                    let sqlInsert = [nome, hash, url, dataAtualizacao, id];
                    sql = mysql.format(sql, sqlInsert);

                    this._connection.query(sql, (err, result, fields) => {
                        if (err) return reject(err);
                        result.changedRows > 0 ? resolve({ message: "Dados alterados com sucesso!" }) : resolve({ message: "Erro, tente novamente mais tarde!" })
                    })
                })
            } else {
                let sql = "UPDATE usuario SET nome=?, senha=?, dataAtualizacao=? where id=?";
                let sqlInsert = [nome, hash, dataAtualizacao, id];
                sql = mysql.format(sql, sqlInsert);

                this._connection.query(sql, (err, result, fields) => {
                    if (err) return reject(err);
                    result.changedRows > 0 ? resolve({ message: "Dados alterados com sucesso!" }) : resolve({ message: "Erro, tente novamente mais tarde!" })
                })
            }
        });
    }

}

module.exports = usuariosDAO;
