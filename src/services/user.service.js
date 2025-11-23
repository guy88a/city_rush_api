const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');

module.exports.getById = async function (id) {
  const db = getDb();
  const users = db.collection('users');

  let user;
  try {
    user = await users.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );
  } catch (err) {
    return { ok: false, status: 400, message: 'Invalid user ID' };
  }

  if (!user) {
    return { ok: false, status: 404, message: 'User not found' };
  }

  return {
    ok: true,
    status: 200,
    data: { user }
  };
};