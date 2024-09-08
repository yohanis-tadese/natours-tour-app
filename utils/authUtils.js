const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const signToken = (id, secret, expiresIn) => {
  return jwt.sign({ id }, secret, { expiresIn });
};

const createSendToken = async (user, statusCode, res) => {
  // Generate Access and Refresh tokens
  const accessToken = signToken(
    user._id,
    process.env.JWT_ACCESS_TOKEN_SECRET,
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
  );

  // Generate new refresh token
  const refreshToken = await createRefreshToken(user);

  // Convert expiration days to milliseconds
  const daysToMillis = (days) => days * 24 * 60 * 60 * 1000;

  const accessTokenExpiresIn = parseInt(
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    10
  );

  const refreshTokenExpiresIn = parseInt(
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    10
  );

  // Cookie options for Access Token
  const accessCookieOptions = {
    expires: new Date(Date.now() + daysToMillis(accessTokenExpiresIn)),
    httpOnly: true,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production',
  };

  // Cookie options for Refresh Token
  const refreshCookieOptions = {
    expires: new Date(Date.now() + daysToMillis(refreshTokenExpiresIn)),
    httpOnly: true,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production',
  };

  // Set Access token in cookie
  res.cookie('accessToken', accessToken, accessCookieOptions);

  // Set Refresh token in cookie
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);

  // Remove password from the response
  user.password = undefined;

  // Send response
  res.status(statusCode).json({
    status: 'success',
    accessToken,
    refreshToken,
    data: {
      user,
    },
  });
};

// Function to create and hash a new refresh token
const createRefreshToken = async (user) => {
  const refreshToken = signToken(
    user._id,
    process.env.JWT_REFRESH_TOKEN_SECRET,
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
  );

  // Hash the refresh token and save it to the user document
  user.refreshToken = await bcrypt.hash(refreshToken, 12);
  await user.save({ validateBeforeSave: false });

  return refreshToken;
};

// ****Function to check if the provided refresh token is valid***
const isValidRefreshToken = async (user, providedToken) => {
  if (!user.refreshToken) {
    console.log('No refresh token found for the user');
    return false;
  }

  // Compare the provided token with the stored hashed token
  return await bcrypt.compare(providedToken, user.refreshToken);
};

module.exports = { createSendToken, isValidRefreshToken };
