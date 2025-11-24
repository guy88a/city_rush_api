// src/services/user.service.js
const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');
const Flow = require('../utils/flow');

module.exports.getById = async function (id) {
  const db = getDb();
  const users = db.collection('users');

  // Create flow with context
  const flow = Flow.start({ id, user: null });

  return flow
    .check(id, 'User ID is required', 400)
    .step(ctx => {
      try {
        ctx.objectId = new ObjectId(ctx.id);
      } catch (err) {
        return { error: 'Invalid user ID', status: 400 };
      }
    })
    .step(async ctx => {
      ctx.user = await users.findOne(
        { _id: ctx.objectId },
        { projection: { password: 0 } }
      );

      if (!ctx.user) {
        return { error: 'User not found', status: 404 };
      }
    })
    .done(ctx => ({
      user: ctx.user
    }));

};
