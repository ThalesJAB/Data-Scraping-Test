const scrapingService = require('../services/data-scraping-service')

exports.getInfo = async (req, res, next) => {
  try {
    resultado = await scrapingService.getInfo(req.body.url)
    res.status(200).send(resultado)
  } catch (error) {
    res.status(404).send({
      message: "Falha ao processar sua requisição, site não encontrado ou cadastrado",
      error: error.message
    });
  }
}

exports.saveInfo = async (req, res, next) => {
  try {
    const result = await scrapingService.saveInfo(req.body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({
      message: "Falha ao processar sua requisição",
      error: error.message
    });
  }
};

exports.updateInfo = async (req, res, next) => {
  try {
    const result = await scrapingService.updateInfo(req.body);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      message: "Falha ao processar sua requisição",
      error: error.message
    });
  }
};

