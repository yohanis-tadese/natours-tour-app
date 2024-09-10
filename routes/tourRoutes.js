const express = require('express');
const tourController = require('../controllers/tourControllers');
const reviewRouter = require('../routes/reviewRoutes');
const authMiddleware = require('../middleware/authMiddleware');

// const tourRouter = express.Router();
const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'lead-guide'),
    tourController.createTours
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
