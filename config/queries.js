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

        //Se tempo foi informado, buscar pratos com aquele tempo e uma margem de 20% para mais e menos
        //Se a pessoa informou 10 minutos, vai procurar pratos com tempo entre 8 e 12 minutos
        if (query.tempo) {
            let margemTempoAntes = query.tempo - (query.tempo / 100 * 20);
            let margemTempoDepois = query.tempo + (query.tempo / 100 * 20);
            let tempo = [margemTempoAntes, margemTempoDepois];
            knexQuery.whereBetween('tempoPreparo', tempo);
        }

        knexQuery.where('public', true) // Sempre buscar pratos públicos
        knexQuery.where('visible', true) // Sempre buscar pratos visiveis

        //Se Ingredientes foram informados, buscar pratos com aqueles ingredientes 
        if (query.ingredientes) {
            let ingredientes = [];

            //Para cada ingrediente, checa se o mesmo existe e poe na variavel ingredientes
            for (let j = 0; j < query.ingredientes.length; j++) {
                let ingredientesQuery = knex('ingrediente')
                ingredientesQuery.where('nome', query.ingredientes[j])
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
                        //Se existe um prato com aquele id e aquele ingrediente, coloca o resultado no array de pratos
                        resultado.push(res[0])
                    }
                }
            }

            let resultadoUnico = getUnique(resultado, 'Id'); //remove os elementos duplicados do array de pratos
            return new Promise((resolve, reject) => {
                resolve(resultadoUnico)
            })
        }

        return knexQuery;
    }
}