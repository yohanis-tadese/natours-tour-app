// const { storage } = require('./cloudinary-config');  // for cloudinary
const multer = require('multer');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  //   storage: storage,
  storage: multerStorage,
  fileFilter: multerFilter,
});

module.exports = upload;
