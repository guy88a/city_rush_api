const { getDb } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.register = async function (data) {
  const db = getDb();
  const users = db.collection('users');

  const { username, email, password } = data;

  // Check existing user
  const exists = await users.findOne({
    $or: [{ username }, { email }]
  });

  if (exists) {
    return { ok: false, status: 409, message: 'Username or email already exists' };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const now = new Date();

  await users.insertOne({
    username,
    email,
    password: hashedPassword,
    type: 'registered',
    createdAt: now,
    lastLogin: now
  });

  return {
    ok: true,
    status: 200,
    data: {
      username,
      email,
      type: 'registered',
      createdAt: now
    }
  };
};


module.exports.login = async function (data) {
  const db = getDb();
  const users = db.collection('users');

  const { username, email, password } = data;

  // Find by username or email
  const user = await users.findOne({
    $or: [
      { username: username || null },
      { email: email || null }
    ]
  });

  if (!user) {
    return { ok: false, status: 404, message: 'User not found' };
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { ok: false, status: 401, message: 'Invalid password' };
  }

  const now = new Date();

  // Update last login
  await users.updateOne(
    { _id: user._id },
    { $set: { lastLogin: now } }
  );

  // Create JWT
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      type: user.type
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    ok: true,
    status: 200,
    data: {
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        email: user.email,
        type: user.type,
        lastLogin: now
      }
    }
  };
};

module.exports.logout = async function () {
  // JWT is stateless — nothing to remove server-side.
  // We return OK so the controller can respond unified.
  return {
    ok: true,
    status: 200,
    data: { message: 'Logged out successfully' }
  };
};