const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// **Protect Routes**
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // Get the token from cookies
  if (req.cookies && req.cookies['accessToken']) {
    token = req.cookies['accessToken'];
  } else {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // Verify the access token
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_ACCESS_TOKEN_SECRET
  );

  // Find the user associated with the token
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // Check if the user's password has changed after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // Set the user in the request object for access to protected routes
  req.user = currentUser;
  next();
});

// **Restrict Access Based on Role**
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if the user role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

// **Check User Login Status Middleware**
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies['accessToken']) {
    try {
      // Verify the access token
      const decoded = await promisify(jwt.verify)(
        req.cookies['accessToken'],
        process.env.JWT_ACCESS_TOKEN_SECRET
      );

      // Find the user associated with the token
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // Check if the user's password has changed after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // Set the current user in the response for further processing
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.isVerified = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('emailVerified');

  if (!user) {
    return next(new AppError('User not found!', 404));
  }

  if (!user.emailVerified) {
    return next(
      new AppError('Email not verified. Please verify your email first.', 403)
    );
  }

  next();
});
