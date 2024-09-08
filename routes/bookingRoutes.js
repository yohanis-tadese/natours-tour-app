const express = require('express');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get(
  '/checkout-session/:tourId',
  authMiddleware.protect,
  bookingController.getCheckoutSession
);

module.exports = router;
