const crypto = require('crypto');
const User = require('../models/userModel');

exports.verifyCode = async (code, next) => {
  //546677464 ///hhhhhhhhhhhhhhhh
  const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
  const user = await User.findOne({
    verificationCode: hashedCode,
    verificationCodeExpires: { $gt: Date.now() },
  });

  return user;
};

exports.createVerificationCode = () => {
  const code = crypto.randomBytes(3).toString('hex');

  const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
  const expirationTime = Date.now() + 10 * 60 * 1000;

  return { code, hashedCode, expirationTime };
};
