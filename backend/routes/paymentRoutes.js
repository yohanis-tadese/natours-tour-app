const express = require('express');
const chapaController = require('../controllers/payimetController');

const router = express.Router();

router.post('/pay', chapaController.initializePayment);

module.exports = router;
