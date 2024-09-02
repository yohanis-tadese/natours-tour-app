const User = require('./../models/userModel');
const path = require('path');
const ejs = require('ejs');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const sendEmail = require('../utils/email');
const {
  verifyCode,
  createVerificationCode,
} = require('../utils/helperFunction');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
};

exports.sendVerificationCode = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError('User not found!', 404));
  }

  if (user.emailVerified) {
    return res.status(200).json({
      status: 'success',
      message: 'Your email is already verified.',
    });
  }

  // Generate OTP
  const { code, hashedCode, expirationTime } = createVerificationCode();

  // Save OTP and expiration time in the database
  user.verificationCode = hashedCode;
  user.verificationCodeExpires = expirationTime;
  await user.save({ validateBeforeSave: false });

  // Render EJS template
  const templatePath = path.join(
    __dirname,
    '../templates/email-verify-otp.ejs'
  );
  const emailHtml = await ejs.renderFile(templatePath, {
    name: user.name || 'User',
    code,
  });

  // Send OTP via email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Verification Code (valid for 10 min)',
      html: emailHtml,
    });

    res.status(200).json({
      status: 'success',
      message: 'Verification code sent to your email',
    });
  } catch (err) {
    return next(
      new AppError('Error sending email. Please try again later.', 500)
    );
  }
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  const user = await verifyCode(code, next);

  if (!user) {
    return next(new AppError('Invalid code or code has expired.', 400));
  }

  user.emailVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({ status: 'sucess', userId: user._id });
});

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
