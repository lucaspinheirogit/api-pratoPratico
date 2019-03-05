class pratosDAO {


    constructor(connection) {
        this._connection = connection;
    }

    //CREATE READ UPDATE DELETE

    create(nome, desc, modo, tempo, dif, dono, foto, publica) {
        return new Promise((resolve, reject) => {
            let data = new Date().toJSON().slice(0, 10);
            let sql = `INSERT INTO pratos
            (Nome, Descricao, ModoPreparo, TempoPreparo, Dificuldade, Dono, Foto, Public, DataCriacao)
            VALUES ('${nome}','${desc}','${modo}','${tempo}','${dif}','${dono}','${foto}','${publica}','${data}')`;

            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    }

    list(offset, limit) {
        return new Promise((resolve, reject) => {
            let resultado = {
                "pratos": '',
                "total": 0
            }

            let sql = `SELECT * FROM pratos WHERE public = '1' ORDER BY id desc LIMIT ${offset}, ${limit}`;
            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resultado.pratos = result;

                let sql2 = `SELECT COUNT(*) FROM pratos where public = '1'`;
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
            let sql = `SELECT * FROM pratos WHERE dono = ${id} and public = '1'`;
            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    }

    get(id) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM pratos WHERE id=${id}`;
            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    }

    random() {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM pratos WHERE public = '1' ORDER BY RAND() LIMIT 1;`;
            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    }


}

module.exports = pratosDAO;
