const jwt = require('jsonwebtoken');
const User = require('../models/User');

function requireAuth() {
  return async (req, _res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
      const user = await User.findById(payload.sub).select('-password');
      if (!user) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
      }
      if (user.isBlocked) {
        const err = new Error('User is blocked');
        err.statusCode = 403;
        throw err;
      }

      req.user = user;
      next();
    } catch (e) {
      e.statusCode = e.statusCode || 401;
      next(e);
    }
  };
}

function requireAdmin() {
  return (req, _res, next) => {
    if (!req.user || req.user.role !== 'admin') {
      const err = new Error('Forbidden');
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
}

module.exports = { requireAuth, requireAdmin };

