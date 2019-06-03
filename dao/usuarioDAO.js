const mysql = require('mysql');
const moment = require('moment');

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

    update(id, nome, senha, img) {
        return new Promise((resolve, reject) => {

            //TODO: SALVAR IMAGEM NO FIREBASE OU AMAZON AWS E SALVAR O LINK DA IMG

            let dataAtualizacao = moment().format('YYYY-MM-DD HH:mm:ss');
            let hash = bcrypt.hashSync(senha, 3);

            let sql = "UPDATE usuario SET nome=?, senha=?, img=?, dataAtualizacao=? where id=?";
            let sqlInsert = [nome, hash, img, dataAtualizacao, id];
            sql = mysql.format(sql, sqlInsert);

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                result.changedRows > 0 ? resolve({ message: "Dados alterados com sucesso!" }) : resolve({ message: "Erro, tente novamente mais tarde!" })
            })
        });
    }

}

module.exports = usuariosDAO;
