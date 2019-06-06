const knex = require('./knex');

function getUnique(arr, comp) {

    const unique = arr
        .map(e => e[comp])

        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)

        // eliminate the dead keys & store unique objects
        .filter(e => arr[e]).map(e => arr[e]);

    return unique;
}

module.exports = {
    search: async (query) => {
        let knexQuery = knex('prato')

        if (query.nome) knexQuery.where('nome', 'like', `%${query.nome}%`)
        if (query.tempo) knexQuery.where('tempoPreparo', 'like', `%${query.tempo}%`)

        knexQuery.where('visible', true)

        if (query.ingredientes) {
            let ingredientes = [];

            for (let j = 0; j < query.ingredientes.length; j++) {
                let ingredientesQuery = knex('ingrediente')
                ingredientesQuery.where('nome', query.ingredientes[j].nome)
                let res = await ingredientesQuery;
                if (res.length > 0) {
                    ingredientes.push(res[0])
                }
            }

            let pratos = await knexQuery;
            var resultado = [];

            for (let i = 0; i < pratos.length; i++) {
                let prato = pratos[i];

                for (let k = 0; k < ingredientes.length; k++) {
                    let ingrediente = ingredientes[k];

                    let PratoIngredienteQuery = knex('prato_ingrediente');
                    PratoIngredienteQuery.where("prato_id", prato.Id)
                    PratoIngredienteQuery.where("ingrediente_id", ingrediente.Id)
                    PratoIngredienteQuery.innerJoin("prato", "prato_ingrediente.prato_id", "prato.id")

                    let res = await PratoIngredienteQuery;
                    if (res.length > 0) {
                        resultado.push(res[0])
                    }
                }
            }

            let resultadoUnico = getUnique(resultado, 'Id');
            
            return new Promise(function(resolve, reject) {
                resolve(resultadoUnico)
            })
        }

        return knexQuery;
    }
}