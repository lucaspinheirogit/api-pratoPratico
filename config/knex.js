const knex = require("knex")({
  client: "mysql",
  connection: {
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
  }
})

module.exports = knex
