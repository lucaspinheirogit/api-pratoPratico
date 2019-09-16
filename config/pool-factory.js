const mysql = require("mysql")

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DATABASE_HOST || "localhost",
  database: process.env.DATABASE_NAME || "pratopratico",
  user: process.env.DATABASE_USERNAME || "root",
  password: process.env.DATABASE_PASSWORD || ""
})

/* eslint-disable consistent-return */
process.on("SIGINT", () =>
  pool.end(err => {
    if (err) return console.log(err)
    process.exit(0)
  })
)

module.exports = pool
