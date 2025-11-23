// ────────────────────────────────────────────────────────────────
// Imports
// ────────────────────────────────────────────────────────────────
const { getDb } = require('../config/database');
const bcrypt = require('bcrypt');

// ────────────────────────────────────────────────────────────────
// Controllers
// ────────────────────────────────────────────────────────────────
async function registerUser(req, res) {
  try {
    const db = getDb();
    const usersCollection = db.collection('users');

    // Extract data from request body
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing username, email, or password' });
    }

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      $or: [
        { username: username },
        { email: email }
      ]
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const newUser = {
      username,
      email,
      password: hashedPassword,
      type: 'registered',
      createdAt: new Date(),
      lastLogin: new Date()
    };

    // Insert into database
    await usersCollection.insertOne(newUser);

    return res.json({
      message: 'User registered successfully',
      user: {
        username,
        email,
        type: 'registered',
        createdAt: new Date()
      }
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
