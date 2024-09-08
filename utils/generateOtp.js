const crypto = require('crypto');

exports.generateOTP = () => crypto.randomInt(100000, 999999).toString();
