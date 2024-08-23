const rateLimit = require("express-rate-limit");
const moment = require("moment");

// Rate limiter to track login attempts
const loginAttemptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  handler: (req, res, next, options) => {
    const now = moment();
    const resetTime = moment(req.rateLimit.resetTime);
    const duration = moment.duration(resetTime.diff(now));

    const minutes = Math.floor(duration.asMinutes());

    res.status(options.statusCode).json({
      message: `Too many login attempts from this IP. Please try again after ${minutes} minute.`,
    });
  },
  keyGenerator: (req) => req.ip,
});

module.exports = loginAttemptLimiter;
