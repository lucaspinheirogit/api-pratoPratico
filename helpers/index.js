const dificuldadeEnum = require('../enums/dificuldade');
const unidadeEnum = require('../enums/unidade');

module.exports = {
    validaDificuldade: (dificuldade) => {
        //Checa se a dificuldade está correta, pois são aceitos valores pré-definidos (enum)
        if (Object.values(dificuldadeEnum).indexOf(dificuldade) == -1) {
            return false
        } else {
            return true
        }
    },
    validaIngredientes: (ingredientes) => {
        let validou = true;
        ingredientes.forEach(ingrediente => {
            //Checa se a unidade de medida está correta , pois são aceitos valores pré-definidos (enum)
            if (Object.values(unidadeEnum).indexOf(ingrediente.unidadeMedida) == -1) {
                validou = false;
            }
        })
        return validou;
    }
}