const express = require("express");
const tourController = require("../controllers/tourControllers");

// const tourRouter = express.Router();
const router = express.Router();

router
  .route("/")
  .post(tourController.createTours)
  .get(tourController.getAllTours);
router
  .route("/:id")
  .get(tourController.getTours)
  .patch(tourController.updateTours)
  .delete(tourController.deleteTours);

module.exports = router;
