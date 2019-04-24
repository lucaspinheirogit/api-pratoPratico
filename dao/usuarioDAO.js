class usuariosDAO {

    constructor(connection) {
        this._connection = connection;
    }

    get(id) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM usuario WHERE id=${id}`;
            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    }

}

module.exports = usuariosDAO;
