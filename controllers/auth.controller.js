// ────────────────────────────────────────────────────────────────
// Imports
// ────────────────────────────────────────────────────────────────
const { getDb } = require('../config/database');

// ────────────────────────────────────────────────────────────────
// Controllers
// ────────────────────────────────────────────────────────────────
async function registerUser(req, res) {
  try {
    const db = getDb();
    const usersCollection = db.collection('users');

    // Extract data from request body
    const { username, email, password } = req.body;

    // Temporary placeholder response
    // (We will implement validation + hashing next step)
    res.json({
      message: 'Register endpoint reached',
      received: { username, email, password }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

// ────────────────────────────────────────────────────────────────
// Exports
// ────────────────────────────────────────────────────────────────
module.exports = {
  registerUser
};
