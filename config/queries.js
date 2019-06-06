const knex = require('./knex');

module.exports = {
    search(query) {
        let knexQuery = knex('prato')

        if (query.nome) knexQuery.where('nome','like', `%${query.nome}%`)
        if (query.tempo) knexQuery.where('tempoPreparo','like', `%${query.tempo}%`)

        knexQuery.where('visible', true)

        return knexQuery;
    }
}