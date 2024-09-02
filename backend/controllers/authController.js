const crypto = require('crypto');
const path = require('path');
const ejs = require('ejs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const { createSendToken, isValidRefreshToken } = require('../utils/authUtils');

// **User Signup**
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, phone, password, passwordConfirm } = req.body;

  const newUser = await User.create({
    name,
    email,
    phone,
    password,
    passwordConfirm,
  });

  // Create and send access and refresh tokens in the response
  createSendToken(newUser, 201, res);
});

// **User Login**
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // Find the user by email
  const user = await User.findOne({ email });

  // Validate user and password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Create and send access and refresh tokens in the response
  createSendToken(user, 200, res);
});

// **Refresh Access Token**
exports.refreshToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies['refreshToken'];

  if (!refreshToken) {
    return next(new AppError('No refresh token found', 401));
  }

  const decoded = await promisify(jwt.verify)(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET
  );

  const currentUser = await User.findById(decoded.id).select('+refreshToken');
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // Use utility function to check validity of the refresh token
  const isValidToken = await isValidRefreshToken(currentUser, refreshToken);
  if (!isValidToken) {
    return next(new AppError('Invalid refresh token', 403));
  }

  // Generate and send new tokens
  createSendToken(currentUser, 200, res);
});

// **Forgot Password**
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Find the user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // Generate a reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash the reset token and save it in the user's record
  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

  await user.save({ validateBeforeSave: false });

  // Create a password reset URL
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  // 2) Read and compile the email template
  const templatePath = path.join(
    __dirname,
    '../templates/passwordResetEmail.ejs'
  );
  const emailHtml = await ejs.renderFile(templatePath, {
    resetURL,
  });

  try {
    // Send the reset token to the user's email
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      resetURL,
      html: emailHtml,
    });

    res.status(200).json({
      status: 'success',
      message: 'Link sent successfully to your email',
    });
  } catch (err) {
    // Handle errors during email sending
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.error('Error sending email:', err);

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

// **Reset Password**
exports.resetPassword = catchAsync(async (req, res, next) => {
  // Hash the provided reset token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Find the user with the reset token and valid expiration time
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // Update the user's password and clear reset token
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Create and send new access and refresh tokens
  createSendToken(user, 200, res);
});

// **Update Password**
exports.updatePassword = catchAsync(async (req, res, next) => {
  // Find the current user by ID
  const user = await User.findById(req.user.id);

  // Check if the current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // Update the user's password and confirm password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // Create and send new access and refresh tokens
  createSendToken(user, 200, res);
});

// **User Logout**
exports.logout = (req, res, next) => {
  res.cookie('accessToken', '', {
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production',
  });

  res.cookie('refreshToken', '', {
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};
