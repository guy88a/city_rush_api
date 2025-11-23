// ────────────────────────────────────────────────────────────────
// Imports
// ────────────────────────────────────────────────────────────────
const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');

// ────────────────────────────────────────────────────────────────
// Get My User (profile)
// ────────────────────────────────────────────────────────────────
async function getMyUser(req, res) {
  try {
    const db = getDb();
    const usersCollection = db.collection('users');

    const userId = req.user.id;

    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user });

  } catch (error) {
    console.error('/user/me error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

// ────────────────────────────────────────────────────────────────
// Exports
// ────────────────────────────────────────────────────────────────
module.exports = {
  getMyUser
};
