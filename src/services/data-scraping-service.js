const { URL } = require("url");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const repository = require('../repositories/data-scraping-repository')

const similarUrl = "https://www.similarweb.com/pt/website/";

async function getInfo(url){

 try{
    const urlBody = await extractDomain(url);
    const resultado = await repository.getInfo(urlBody);

    return resultado;

  }catch(error){
      throw error
  }


}

async function saveInfo(body) {
  try {
    const urlBody = await extractDomain(body.url);
   
    console.log(similarUrl + urlBody);

    // Cria uma nova instância do puppeteer
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Criando um User Agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    );
    await page.goto(similarUrl + urlBody, { waitUntil: "domcontentloaded" });

    // Aguarde a execução do JavaScript, desafio JavaScript
    await page.waitForTimeout(6000); // 6 segundos 

    // Conteúdo da página 
    const content = await page.content();
   

    await browser.close();

    let dataScrapingData = await recuperarDadosSimilarWeb(content)

  
    dataScrapingData.site = urlBody;

    await repository.saveInfo(dataScrapingData);



    return dataScrapingData;
  } catch (error) {
      throw error;
  }
}


async function updateInfo(body){

  try {
    const urlBody = await extractDomain(body.url);
   
    console.log(similarUrl + urlBody);

    // Cria uma nova instância do puppeteer
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Criando um User Agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    );
    await page.goto(similarUrl + urlBody, { waitUntil: "domcontentloaded" });

     // Aguarde a execução do JavaScript, desafio JavaScript
    await page.waitForTimeout(6000); // 6 segundos

    // Conteúdo da página t
    const content = await page.content();
   

    await browser.close();

    let dataScrapingData = await recuperarDadosSimilarWeb(content)

  
    dataScrapingData.site = urlBody;

    await repository.updateInfo(dataScrapingData);



    return dataScrapingData;
  } catch (error) {
      throw error;
  }

}

//Extrai o domonio da url
async function extractDomain(url) {
  try {
    const fixedUrl =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `http://${url}`;

    const parsedUrl = new URL(fixedUrl);
    return parsedUrl.hostname;
  } catch (error) {
    console.error("Erro ao analisar a URL:", error.message);
    throw error;
  }
}

//Capturar de dados do SimilarWeb
async function recuperarDadosSimilarWeb(content){
  
  // Recebe conteúdo do site
  const $ = cheerio.load(content);

  
  const divGlobalRank = $(".wa-rank-list__item--global .wa-rank-list__value");
  const divCountryRank = $(".wa-rank-list__item--country .wa-rank-list__value");
  const divCategory = $(".wa-rank-list__item--category .wa-rank-list__info a");
  const divCategoryRank = $(".wa-rank-list__item--category .wa-rank-list__value");
  const divDemographicsGender = $(".wa-demographics__gender");

  let globalRank = "";
  let paisRank = "";
  let categoria = "";
  let categoriaRank = "";
  let totalVisitas = "";
  let taxaRejeicao = "";
  let paginasPorVisita = "";
  let duracaoMediaVisita = "";
  let distribuicaoPorGenero = [];
  let principaisPaises = [];
  let distribuicaoPorIdade = [];

  
  // Classificação Global | Classificação por País | Classificação por categoria | Categoria
  if (divGlobalRank.length > 0 || divCountryRank.length > 0 || divCategoryRank.length > 0 || divCategory.length > 0) {
    // Encontrar a div dentro da div global com a classe wa-rank-list__value
    globalRank = parseInt(divGlobalRank.text().trim().replace('#', '').replace(',', ''));
    paisRank = parseInt(divCountryRank.text().trim().replace('#', '').replace(',', ''));
    categoriaRank = parseInt(divCategoryRank.text().trim().replace('#', '').replace(',', ''));
    categoria = divCategory.text().trim();
  }

    
    
  // Total de Visitas | Taxa de Reijeição | Páginas por Visita | Duração Média da Visita
  $('.engagement-list__item').each((index, element) => {
    
    const nameElement = $(element).find('.engagement-list__item-name');
    const valueElement = $(element).find('.engagement-list__item-value');

    
    const name = nameElement.text().trim();
    const value = valueElement.text().trim();


    if (name === "Total de Visitas") {
      totalVisitas = value;
    } else if (name === "Taxa de Rejeição") {
      taxaRejeicao = parseFloat(value.replace('%', '')) / 100;
    } else if (name === "Páginas por Visita") {
      paginasPorVisita = parseFloat(value)
    } else if (name === "Duração Média da Visita") {
      duracaoMediaVisita = value;
    }
  

  })

  // Distribuição por Gênero
  if (divDemographicsGender.length > 0) {

    divDemographFemale = divDemographicsGender.find('.wa-demographics__gender-legend-item--female');
    divDemographMale = divDemographicsGender.find('.wa-demographics__gender-legend-item--male');
    
    if(divDemographFemale.length > 0){
      const femalePercentage = divDemographFemale.find('.wa-demographics__gender-legend-item-value').text().trim();


      const genderInfo = {
        genero: 'Feminino',
        percentual: parseFloat(femalePercentage.replace('%', '')) / 100
      }

      distribuicaoPorGenero.push(genderInfo);
      
    }

    if(divDemographMale.length > 0){
      const malePercentage = divDemographMale.find('.wa-demographics__gender-legend-item-value').text().trim();
      
      const genderInfo = {
        genero: 'Masculino',
        percentual: parseFloat(malePercentage.replace('%', '')) / 100
      };

      distribuicaoPorGenero.push(genderInfo);

    }

  }

  //Principais Paises e percentual
  $('.wa-geography__country').each((index, element) => {
    const nameElement = $(element).find('.wa-geography__country-name');
    const valueElement = $(element).find('.wa-geography__country-traffic-value');

  
    const name = nameElement.text().trim();
    const value = valueElement.text().trim();

    let countryInfo = {
      pais: name,
      percentual: parseFloat(value.replace('%', '')) / 100
    }

    principaisPaises.push(countryInfo)
  })

  //Distruibuição por idade
  
  $('.highcharts-data-label').each((index, element) => {
    
    const parentElement = $(element).closest('.highcharts-root');
    const ageElement = parentElement.find('.highcharts-axis-labels text').eq(index); // Usar o índice
    const age = ageElement.text().trim();
      
    // Encontrar porcentagem
    const valueElement = $(element).find('.wa-demographics__age-data-label');
    const value = valueElement.text().trim();
      
    if (value !== '' && age !== '') {
      let ageInfo = {
        idade: age,
        percentual: parseFloat(value.replace('%', '')) / 100
      };

      distribuicaoPorIdade.push(ageInfo);
    }

  });
  
  
  console.log("Classificação Global: "+ globalRank);
  console.log("Classificação País: "+ paisRank);
  console.log("Categoria: "+ categoria);
  console.log("Categoria Ranking: "+ categoriaRank);
  console.log("Total de Visitas: "+ totalVisitas);
  console.log("Taxa de Rejeição: "+ taxaRejeicao);
  console.log("Paginas por Visita: "+ paginasPorVisita);
  console.log("Duração Média por Visita: "+ duracaoMediaVisita);
  console.log("Distribuição por Gênero: ")
  distribuicaoPorGenero.forEach(element => {
    console.log(element.genero +": " + element.percentual)
  });
  console.log("Principais Paises: ")
  principaisPaises.forEach(element => {
    console.log(element.pais +": " + element.percentual)
  });
  console.log("Distribuição por Idade: ")
  distribuicaoPorIdade.forEach(element => {
    console.log(element.idade +": " + element.percentual)
  });

  const dataScrapingData = {
    classificacaoGlobal: globalRank,
    classificacaoPais: paisRank,
    categoria: categoria,
    categoriaRanking: categoriaRank,
    totalVisita: totalVisitas,
    duracaoMediaVisita: duracaoMediaVisita,
    paginaPorVisita: paginasPorVisita,
    taxaRejeicao: taxaRejeicao,
    principaisPaises: principaisPaises,
    distribuicaoGenero: distribuicaoPorGenero,
    distribuicaoIdade: distribuicaoPorIdade  
  };

  return dataScrapingData;

}

module.exports = {
  getInfo,
  saveInfo,
  updateInfo
};
