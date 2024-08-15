const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const tourRoutes = require("./routes/tourRoutes");

const app = express();

//MIDDLEWARE
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }
if (process.argv[2] === "hello") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//ROUTES
app.use("/api/v1/tours", tourRoutes);

module.exports = app;
