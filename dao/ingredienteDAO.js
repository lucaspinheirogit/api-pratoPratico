const mysql = require('mysql');

class ingredienteDAO {
  constructor(connection) {
    this.Connection = connection;
  }

  create(pratoId, nome, quantidade, unidadeMedida) {
    return new Promise((resolve, reject) => {
      // checa se o ingrediente já existe, se não existir ainda, cria-lo
      this.jaExiste(pratoId, nome, quantidade, unidadeMedida)
        .then((resultado) => {
          if (resultado) {
            resolve();
          } else {
            let sql = 'INSERT INTO ingrediente (Nome) VALUES (?)';
            const sqlInsert = [nome];
            sql = mysql.format(sql, sqlInsert);

            this.Connection.query(sql, (err, result) => {
              if (err) return reject(err);

              let sql = 'INSERT INTO prato_ingrediente (prato_id, ingrediente_id, quantidade, unidademedida) VALUES (?, ?, ?, ?)';
              const sqlInsert = [pratoId, result.insertId, quantidade, unidadeMedida];
              sql = mysql.format(sql, sqlInsert);

              this.Connection.query(sql, (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId);
              });
            });
          }
        });
    });
  }

  list() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM ingrediente';
      this.Connection.query(sql, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM ingrediente WHERE id=?';
      const sqlInsert = [id];
      sql = mysql.format(sql, sqlInsert);

      this.Connection.query(sql, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  jaExiste(pratoId, nome, quantidade, unidadeMedida) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM ingrediente WHERE nome=?';
      const sqlInsert = [nome];
      sql = mysql.format(sql, sqlInsert);

      this.Connection.query(sql, (err, result) => {
        if (err) return reject(err);

        if (result.length > 0) {
          let sql = 'INSERT INTO prato_ingrediente (prato_id, ingrediente_id, quantidade, unidademedida) VALUES (?, ?, ?, ?)';
          const sqlInsert = [pratoId, result[0].Id, quantidade, unidadeMedida];
          sql = mysql.format(sql, sqlInsert);

          this.Connection.query(sql, (err) => {
            if (err) return reject(err);
            resolve(true);
          });
        } else {
          resolve(result.length > 0);
        }
      });
    });
  }
}

module.exports = ingredienteDAO;
