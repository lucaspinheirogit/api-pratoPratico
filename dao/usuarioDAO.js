const mysql = require("mysql")
const moment = require("moment")
const bcrypt = require("bcrypt")
const imgHelper = require("../helpers/imageUpload")

class usuariosDAO {
  constructor(connection) {
    this.Connection = connection
  }

  list() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM usuario"

      this.Connection.query(sql, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  get(id) {
    return new Promise((resolve, reject) => {
      let sql = "SELECT * FROM usuario WHERE id=?"
      const sqlInsert = [id]
      sql = mysql.format(sql, sqlInsert)

      this.Connection.query(sql, (err, result) => {
        if (err) return reject(err)
        const resposta = result[0]

        let sql = "SELECT * FROM prato WHERE dono=? and visible=true"
        const sqlInsert = [id]
        sql = mysql.format(sql, sqlInsert)
        this.Connection.query(sql, (err, result) => {
          if (err) return reject(err)
          resposta.pratos = result

          let sql =
            "SELECT prato_id FROM favorito INNER JOIN prato ON favorito.prato_id = prato.id WHERE usuario_id = ?"
          const sqlInsert = [id]
          sql = mysql.format(sql, sqlInsert)

          this.Connection.query(sql, (err, result) => {
            const favoritos = result.map(r => r.prato_id)
            resposta.favoritos = favoritos
            resolve(resposta)
          })
        })
      })
    })
  }

  update(id, nome, senha, img) {
    return new Promise(async (resolve, reject) => {
      const dataAtualizacao = moment().format("YYYY-MM-DD HH:mm:ss")
      const hash = bcrypt.hashSync(senha, 3)

      if (img) {
        const url = await imgHelper.uploadImageGetURL(img)
        let sql =
          "UPDATE usuario SET nome=?, senha=?, img=?, dataAtualizacao=? where id=?"
        const sqlInsert = [nome, hash, url, dataAtualizacao, id]
        sql = mysql.format(sql, sqlInsert)

        this.Connection.query(sql, (err, result) => {
          if (err) return reject(err)
          result.changedRows > 0
            ? resolve({ message: "Dados alterados com sucesso!" })
            : resolve({ message: "Erro, tente novamente mais tarde!" })
        })
      } else {
        let sql =
          "UPDATE usuario SET nome=?, senha=?, dataAtualizacao=? where id=?"
        const sqlInsert = [nome, hash, dataAtualizacao, id]
        sql = mysql.format(sql, sqlInsert)

        this.Connection.query(sql, (err, result) => {
          if (err) return reject(err)
          result.changedRows > 0
            ? resolve({ message: "Dados alterados com sucesso!" })
            : resolve({ message: "Erro, tente novamente mais tarde!" })
        })
      }
    })
  }
}

module.exports = usuariosDAO
