const Token = require('../utils/token');

function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];

  if (!header) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const parts = header.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  const token = parts[1];
  const result = Token.verify(token);

  if (!result.ok) {
    return res.status(401).json({ error: result.message });
  }

  // Attach decoded payload
  req.user = result.decoded;

  next();
}

module.exports = authMiddleware;
