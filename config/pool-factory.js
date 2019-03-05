require('dotenv').config()
const mysql = require('mysql');

/*
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "162.241.2.143",
    user: "proje133_lucas",
    password: "minecraft123",
    database: "proje133_pratopratico"
});*/

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

pool.on('release', () => console.log('pool => conexão retornada'));

process.on('SIGINT', () =>
    pool.end(err => {
        if (err) return console.log(err);
        process.exit(0);
    })
);

module.exports = pool;