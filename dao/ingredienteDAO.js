class ingredienteDAO {

    constructor(connection) {
        this._connection = connection;
    }

    create(nome) {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO ingrediente (Nome) VALUES ('${nome}')`;
            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result);
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
            let sql = `SELECT * FROM ingrediente WHERE id=${id}`;
            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    }


}

module.exports = ingredienteDAO;
