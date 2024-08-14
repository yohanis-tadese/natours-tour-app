const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.createTours = (req, res) => {
  res.status(200).json({
    status: "sucess",
    results: tours.length,
    data: {
      tours,
    },
  });
};
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "sucess",
    results: tours.length,
    data: {
      tours,
    },
  });
};
exports.getTours = (req, res) => {
  res.status(200).json({
    status: "sucess",
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.updateTours = (req, res) => {
  res.status(200).json({
    status: "sucess",
    results: tours.length,
    data: {
      tours,
    },
  });
};
exports.deleteTours = (req, res) => {
  res.status(200).json({
    status: "sucess",
    results: tours.length,
    data: {
      tours,
    },
  });
};
