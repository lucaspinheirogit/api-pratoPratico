const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const moment = require('moment');
const helper = require('../helpers');

class loginDAO {
  constructor(connection) {
    this.Connection = connection;
  }

  login(email, senha) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM usuario WHERE email=?';
      const sqlInsert = [email];
      sql = mysql.format(sql, sqlInsert);

      this.Connection.query(sql, (err, result) => {
        if (err) return reject(err);
        if (result.length > 0) {
          if (bcrypt.compareSync(senha, result[0].Senha)) {
            const payload = {
              id: result[0].Id,
              username: result[0].Nome,
              role: result[0].Role,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
              expiresIn: '7d', // expira em 7 dias
            });

            resolve({
              auth: true,
              mensagem: 'Login Válido!',
              token,
              username: payload.username,
              role: payload.role,
            });
          } else {
            resolve({
              auth: false,
              mensagem: 'Email e/ou Senha incorretos!',
            });
          }
        } else {
          resolve({
            auth: false,
            mensagem: 'Email e/ou Senha incorretos!',
          });
        }
      });
    });
  }

  signup(nome, img, imgNome, email, senha) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM usuario WHERE email=?';
      const sqlInsert = [email];
      sql = mysql.format(sql, sqlInsert);

      this.Connection.query(sql, (err, result) => {
        if (err) return reject(err);
        if (result.length > 0) {
          resolve({
            auth: false,
            mensagem: 'Esse email já foi cadastrado!',
          });
        } else {
          img = helper.base64ImageToBlob(img);
          helper.uploadImageGetUrl(img, imgNome, nome).then((url) => {
            const hash = bcrypt.hashSync(senha, 3);
            const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss');

            let sql = 'INSERT INTO usuario (nome, img, email, senha, dataCriacao) VALUES (?, ?, ?, ?, ?)';
            const sqlInsert = [nome, url, email, hash, dataCriacao];
            sql = mysql.format(sql, sqlInsert);

            this.Connection.query(sql, (err) => {
              if (err) return reject(err);
              resolve({
                auth: true,
                email,
                senha,
              });
            });
          });
        }
      });
    });
  }
}

module.exports = loginDAO;
