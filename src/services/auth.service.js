const { getDb } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Flow = require('../utils/flow');


module.exports.register = function (data) {
  const db = getDb();
  const users = db.collection('users');

  const flow = Flow.start({
    username: data.username,
    email: data.email,
    password: data.password,
    now: new Date(),
    hashedPassword: null
  });

  return flow

    // STEP 1 — Validate input presence (note: you already run validator before this)
    .check(flow.context.username, "Username is required")
    .check(flow.context.email, "Email is required")
    .check(flow.context.password, "Password is required")

    // STEP 2 — Check if user already exists
    .step(async ctx => {
      const exists = await users.findOne({
        $or: [{ username: ctx.username }, { email: ctx.email }]
      });

      if (exists) {
        return { error: "Username or email already exists", status: 409 };
      }
    })

    // STEP 3 — Hash password
    .step(async ctx => {
      ctx.hashedPassword = await bcrypt.hash(ctx.password, 10);
    })

    // STEP 4 — Insert new user
    .step(async ctx => {
      await users.insertOne({
        username: ctx.username,
        email: ctx.email,
        password: ctx.hashedPassword,
        type: "registered",
        createdAt: ctx.now,
        lastLogin: ctx.now
      });
    })

    // FINAL — return response
    .done(ctx => ({
      username: ctx.username,
      email: ctx.email,
      type: "registered",
      createdAt: ctx.now
    }));
};


module.exports.login = function (data) {
  const db = getDb();
  const users = db.collection('users');

  const flow = Flow.start({
    username: data.username,
    email: data.email,
    password: data.password,
    user: null,
    now: new Date(),
    token: null
  });

  return flow

    // STEP 1 — Validate presence input (your validator already does this, but safe)
    .check(flow.context.password, "Password is required")
    .check(flow.context.username || flow.context.email, "Username or email is required")

    // STEP 2 — Fetch user by username OR email
    .step(async ctx => {
      ctx.user = await users.findOne({
        $or: [
          { username: ctx.username || null },
          { email: ctx.email || null }
        ]
      });

      if (!ctx.user) {
        return { error: "User not found", status: 404 };
      }
    })

    // STEP 3 — Check password match
    .step(async ctx => {
      const match = await bcrypt.compare(ctx.password, ctx.user.password);

      if (!match) {
        return { error: "Invalid password", status: 401 };
      }
    })

    // STEP 4 — Update lastLogin
    .step(async ctx => {
      await users.updateOne(
        { _id: ctx.user._id },
        { $set: { lastLogin: ctx.now } }
      );
    })

    // STEP 5 — Generate JWT
    .step(ctx => {
      ctx.token = jwt.sign(
        {
          id: ctx.user._id,
          username: ctx.user.username,
          type: ctx.user.type
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
    })

    // FINAL — Return success object
    .done(ctx => ({
      message: "Login successful",
      token: ctx.token,
      user: {
        username: ctx.user.username,
        email: ctx.user.email,
        type: ctx.user.type,
        lastLogin: ctx.now
      }
    }));
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