const axios = require('axios');
const dotenv = require('dotenv');
const asyncHandler = require('../utils/catchAsync');
const customError = require('../utils/appError');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

// Initialize Payment
exports.initializePayment = asyncHandler(async (req, res, next) => {
  const { amount, currency, email, first_name, last_name, phone_number } =
    req.body;

  const paymentData = {
    amount: amount,
    currency: currency,
    email: email,
    first_name: first_name,
    last_name: last_name,
    phone_number: phone_number,
    tx_ref: `txn_${uuidv4()}`,
    callback_url: 'https://webhook.site/your-callback-url',
    return_url: 'https://www.google.com/',
    'customization[title]': 'Payment for my favourite merchant',
    'customization[description]': 'I love online payments',
    'meta[hide_receipt]': 'true',
  };

  const options = {
    method: 'POST',
    url: 'https://api.chapa.co/v1/transaction/initialize',
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    data: paymentData,
  };

  try {
    const response = await axios(options);
    res.status(200).json({
      status: 'success',
      data: response.data,
    });
  } catch (error) {
    return next(customError('Failed to initialize payment', 500));
  }
});
