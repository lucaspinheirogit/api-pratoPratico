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
                        resolve({ "Message": "ingrediente já existia" })
                    } else {
                        let sql = `INSERT INTO ingrediente (Nome) VALUES ('${nome}')`;
                        this._connection.query(sql, (err, result, fields) => {
                            if (err) return reject(err);
                            resolve(result);
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
            let sql = `SELECT * FROM ingrediente WHERE id=${id}`;
            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                resolve(result);
            })
        });
    }

    jaExiste(nome) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM ingrediente WHERE nome='${nome}'`;
            this._connection.query(sql, (err, result, fields) => {
                if (err) return reject(err);
                console.log(result.length > 0);
                resolve(result.length > 0);
            })
        })
    }

}

module.exports = ingredienteDAO;
