const express = require("express");
const tourController = require("../controllers/tourControllers");

// const tourRouter = express.Router();
const router = express.Router();

router.route("/tour-stats").get(tourController.getTourStats);

router.route("/monthly-plan/:year").get(
  // authController.protect,
  // authController.restrictTo("admin", "lead-guide", "guide"),
  tourController.getMonthlyPlan
);

router
  .route("/")
  .post(tourController.createTours)
  .get(tourController.getAllTours);
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
