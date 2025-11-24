const jwt = require('jsonwebtoken');

module.exports.verify = function (token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { ok: true, decoded };
  } catch (err) {
    return { ok: false, message: 'Invalid or expired token' };
  }
};