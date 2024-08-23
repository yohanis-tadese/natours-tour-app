const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Create a new tour
exports.createTours = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

// Get all tours
exports.getAllTours = catchAsync(async (req, res) => {
  // Initialize APIFeatures with the Mongoose query and query string
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Execute the query
  const tours = await features.query;

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

// Get a single tour by ID
exports.getTour = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;
  const tour = await Tour.findById(tourId);

  if (!tour) {
    return next(new AppError(`No tour found with ID of ${tourId} `, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

// Update a tour by ID
exports.updateTour = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;
  const tour = await Tour.findByIdAndUpdate(tourId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError(`No tour found with ID of ${tourId} `, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

// Delete a tour by ID
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;
  const tour = await Tour.findByIdAndDelete(tourId);

  if (!tour) {
    return next(new AppError(`No tour found with ID of ${tourId} `, 404));
  }

  res.status(204).json({
    status: "success",
    message: "Tour deleted successfully",
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 2.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1, month: 1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});
