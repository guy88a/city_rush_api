// ────────────────────────────────────────────────────────────────
// Imports
// ────────────────────────────────────────────────────────────────
const { getDb } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

async function loginUser(req, res) {
  try {
    const db = getDb();
    const usersCollection = db.collection('users');

    // Extract login fields
    const { username, email, password } = req.body;

    // Validate input
    if ((!username && !email) || !password) {
      return res.status(400).json({
        error: 'Missing username/email or password'
      });
    }

    // Find user by username or email
    const user = await usersCollection.findOne({
      $or: [
        { username: username || null },
        { email: email || null }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Update last login time
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        type: user.type
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      token: token,
      user: {
        username: user.username,
        email: user.email,
        type: user.type,
        lastLogin: new Date()
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function logoutUser(req, res) {
  return res.json({ message: 'Logged out successfully' });
}

// ────────────────────────────────────────────────────────────────
// Exports
// ────────────────────────────────────────────────────────────────
module.exports = {
  registerUser,
  loginUser,
  logoutUser
};
