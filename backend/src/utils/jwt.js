const jwt = require('jsonwebtoken');

function signAccessToken(userId) {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

module.exports = { signAccessToken };

