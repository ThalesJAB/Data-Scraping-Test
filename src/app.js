const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const router = express.Router();

//Conecta ao banco
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Banco Conectado"))
.catch((error) => console.log(error))







//Carrega os Models
const DataScraping = require('../src/models/data-scraping-model');



//Carrega as Rotas
const scrapingRouts = require("./routes/data-scraping-route")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




app.use('/', scrapingRouts);



module.exports = app;