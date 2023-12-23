
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    
    site: {
        type: String,
        required: true,
        unique:true

    },

    classificacaoGlobal: {
        type: Number,
        required: true,

    },

    classificacaoPais: {
        type: Number,
        required: true,

    },

    categoria: {
        type: String,
        required: true,

    },

    categoriaRanking: {
        type: Number,
        required: true
    },

    totalVisita: {
        type: String,
        required: true
    },

    duracaoMediaVisita: {
        type: String,
        required: true
    },

    paginaPorVisita: {
        type: Number,
        required: true
    },


    taxaRejeicao: {
        type: Number,
        required: true,
    },

    principaisPaises: [{
        pais: String,
        percentual: Number
    }],

    distribuicaoGenero: [{
        genero: String,
        percentual: Number
    }],

    distribuicaoIdade: [{
        idade: String,
        percentual: Number
    }],

});

module.exports = mongoose.model('DataScrapingData', schema);

// v Classificação, v Site, v Categoria, Mudança de Ranking, Duração Média da Visita, Páginas por Visita, 
// Taxa de Rejeição, Principais Países, Distribuição por Gênero, Distribuição por Idade, entre outros dados disponíveis.
