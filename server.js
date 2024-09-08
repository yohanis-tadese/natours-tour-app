const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch((err) => {
    console.error('DB connection error:', err);
    process.exit(1);
  });

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`App is running on port ${port} ...`);
});
