const express = require('express');
const router = express.Router();
const scrapingController = require('../controllers/data-scraping-controller');


router.get('/get_info', scrapingController.getInfo);
router.post('/save_info', scrapingController.saveInfo);
router.put('/update_info', scrapingController.updateInfo);


module.exports = router;