const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const loginAttemptLimiter = require('../utils/rateLimiter');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', loginAttemptLimiter, authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Refresh token route
router.post('/refreshToken', authController.refreshToken);

// Protect all routes after this middleware
router.use(authMiddleware.protect);

// verify email or phone
router.post('/send/verificationCode', authController.sendVerificationCode);
router.post('/verify/verifyEmail', authController.verifyEmail);

router.post('/logout', authController.logout);
router.patch('/updateMyPassword', authController.updatePassword);

router.route('/getMe').get(userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.route('/deactivateMe').patch(userController.deactivateMe);

router.use(authMiddleware.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
