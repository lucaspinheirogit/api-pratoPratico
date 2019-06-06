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

        //Se nome foi informado, buscar pratos com aquele nome 
        if (query.nome) knexQuery.where('nome', 'like', `%${query.nome}%`)

        //Se tempo foi informado, buscar pratos com aquele nome 
        if (query.tempo) knexQuery.where('tempoPreparo', 'like', `%${query.tempo}%`)

        knexQuery.where('public', true) // Sempre buscar pratos públicos
        knexQuery.where('visible', true) // Sempre buscar pratos visiveis

        //Se Ingredientes foram informados, buscar pratos com aqueles ingredientes 
        if (query.ingredientes) {
            let ingredientes = [];

            //Para cada ingrediente, checa se o mesmo existe e poe na variavel ingredientes
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

            //Para cada prato, checa se os ingredientes pertencem a ele
            for (let i = 0; i < pratos.length; i++) {
                let prato = pratos[i];

                for (let k = 0; k < ingredientes.length; k++) {
                    let ingrediente = ingredientes[k];

                    let PratoIngredienteQuery = knex('prato_ingrediente');
                    PratoIngredienteQuery.where("prato_id", prato.Id)
                    PratoIngredienteQuery.where("ingrediente_id", ingrediente.Id)
                    PratoIngredienteQuery.innerJoin("prato", "prato_ingrediente.prato_id", "prato.id")

                    //Pega a tabela prato_ingrediente e checa se o prato(id) e o ingrediente(id) dao match 

                    let res = await PratoIngredienteQuery;
                    if (res.length > 0) {
                        resultado.push(res[0])
                    }
                }
            }

            let resultadoUnico = getUnique(resultado, 'Id'); //remove os elementos duplicados do array de pratos
            return new Promise(function(resolve, reject) {
                resolve(resultadoUnico)
            })
        }

        return knexQuery;
    }
}