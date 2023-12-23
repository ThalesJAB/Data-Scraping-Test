const mongoose = require("mongoose");
const DataScrapingData = mongoose.model("DataScrapingData");

exports.getInfo = async (url) => {
  try{
    const resultadoMongoDB = await DataScrapingData.findOne({ site: url });

    console.log(url);

    if (resultadoMongoDB != null) {
      const resultadoFormatado = {
        classificacaoGlobal: resultadoMongoDB.classificacaoGlobal,
        classificacaoPais: resultadoMongoDB.classificacaoPais,
        categoria: resultadoMongoDB.categoria,
        categoriaRanking: resultadoMongoDB.categoriaRanking,
        totalVisita: resultadoMongoDB.totalVisita,
        duracaoMediaVisita: resultadoMongoDB.duracaoMediaVisita,
        paginaPorVisita: resultadoMongoDB.paginaPorVisita,
        taxaRejeicao: resultadoMongoDB.taxaRejeicao,
        principaisPaises: resultadoMongoDB.principaisPaises,
        distribuicaoGenero: resultadoMongoDB.distribuicaoGenero,
        distribuicaoIdade: resultadoMongoDB.distribuicaoIdade,
        site: resultadoMongoDB.site,
      };
      return resultadoFormatado;
    }else{
      throw new Error("Site ainda não cadastrado");
    }
  }catch(error){
    throw new Error(error);
  }
};


exports.saveInfo = async (data) => {
    try{
    const siteExistente = await DataScrapingData.findOne({ site: data.site });

    if (siteExistente == null) {
            
      
        const dataScrapingData = new DataScrapingData({
            site: data.site,
            classificacaoGlobal: data.classificacaoGlobal,
            classificacaoPais: data.classificacaoPais,
            categoria: data.categoria,
            categoriaRanking: data.categoriaRanking,
            totalVisita: data.totalVisita,
            duracaoMediaVisita: data.duracaoMediaVisita,
            paginaPorVisita: data.paginaPorVisita,
            taxaRejeicao: data.taxaRejeicao,
            principaisPaises: data.principaisPaises,
            distribuicaoGenero: data.distribuicaoGenero,
            distribuicaoIdade: data.distribuicaoIdade,
        });

        const resultado = await dataScrapingData.save();
        return resultado;
    }else{
        throw new Error(`Site ja cadastrado: ${siteExistente.site}`);
    }
    
  }catch(error){
    throw new Error(error);
  }
    
};

exports.updateInfo = async (data) => {
  try{
  let siteExistenteBanco = await DataScrapingData.findOne({ site: data.site }).exec();
  

  if (siteExistenteBanco != null) {
     
    siteExistenteBanco.site = data.site;
    siteExistenteBanco.classificacaoGlobal = data.classificacaoGlobal;
    siteExistenteBanco.classificacaoPais = data.classificacaoPais;
    siteExistenteBanco.categoria = data.categoria;
    siteExistenteBanco.categoriaRanking = data.categoriaRanking;
    siteExistenteBanco.totalVisita = data.totalVisita;
    siteExistenteBanco.duracaoMediaVisita = data.duracaoMediaVisita;
    siteExistenteBanco.paginaPorVisita = data.paginaPorVisita;
    siteExistenteBanco.taxaRejeicao = data.taxaRejeicao;
    siteExistenteBanco.principaisPaises = data.principaisPaises;
    siteExistenteBanco.distribuicaoGenero = data.distribuicaoGenero;
    siteExistenteBanco.distribuicaoIdade = data.distribuicaoIdade;
    
    const resultado = await siteExistenteBanco.save();
    return resultado;
  }
  else{
      throw new Error("Site não cadastrado:");
  }
  
}catch(error){
  throw new Error(error);
}
  
};
