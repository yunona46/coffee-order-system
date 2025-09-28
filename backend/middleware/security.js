const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');

// MongoDB injection protection
const mongoSanitization = mongoSanitize();

// XSS protection
const xssProtection = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    });
  }
  next();
};

// Security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
});

module.exports = {
  mongoSanitization,
  xssProtection,
  securityHeaders
};