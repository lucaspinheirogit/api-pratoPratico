const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const moment = require('moment');
const imgHelper = require('../helpers/imageUpload');

class AuthDAO {
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

  signup(nome, email, senha, image) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM usuario WHERE email=?';
      const sqlInsert = [email];
      sql = mysql.format(sql, sqlInsert);

      this.Connection.query(sql, async (err, result) => {
        if (err) return reject(err);
        if (result.length > 0) {
          resolve({
            auth: false,
            mensagem: 'Esse email já foi cadastrado!',
          });
        } else {
          const hash = bcrypt.hashSync(senha, 3);
          const dataAtual = moment().format('YYYY-MM-DD HH:mm:ss');
          const url = await imgHelper.uploadImageGetURL(image);

          let sql = 'INSERT INTO usuario (nome, img, email, senha, dataCriacao, dataAtualizacao) VALUES (?, ?, ?, ?, ?, ?)';
          const sqlInsert = [nome, url, email, hash, dataAtual, dataAtual];
          sql = mysql.format(sql, sqlInsert);

          this.Connection.query(sql, (err) => {
            if (err) return reject(err);
            resolve({
              auth: true,
              email,
              senha,
            });
          });
        }
      });
    });
  }

  // loginWithGoogle(email, nome, foto) {
  //   return new Promise((resolve, reject) => {
  //     let sql = 'SELECT * FROM usuario WHERE email=?';
  //     const sqlInsert = [email];
  //     sql = mysql.format(sql, sqlInsert);

  //     this.Connection.query(sql, (err, result) => {
  //       if (err) return reject(err);
  //       if (result.length > 0) {
  //         const payload = {
  //           id: result[0].Id,
  //           username: result[0].Nome,
  //           role: result[0].Role,
  //         };

  //         const token = jwt.sign(payload, process.env.JWT_SECRET, {
  //           expiresIn: '7d', // expira em 7 dias
  //         });

  //         resolve({
  //           auth: true,
  //           mensagem: 'Login Válido!',
  //           token,
  //           username: payload.username,
  //           role: payload.role,
  //         });
  //       } else {
  //         const hash = bcrypt.hashSync(senha, 3);
  //         const dataAtual = moment().format('YYYY-MM-DD HH:mm:ss');

  //         let sql = 'INSERT INTO usuario (nome, img, email, senha, dataCriacao, dataAtualizacao) VALUES (?, ?, ?, ?, ?, ?)';
  //         const sqlInsert = [nome, foto, email, hash, dataAtual, dataAtual];
  //         sql = mysql.format(sql, sqlInsert);

  //         this.Connection.query(sql, (err) => {
  //           if (err) return reject(err);
  //           resolve({
  //             auth: true,
  //             email,
  //           });
  //         });
  //       }
  //     });
  //   });
  // }
}

module.exports = AuthDAO;
