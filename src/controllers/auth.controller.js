// ────────────────────────────────────────────────────────────────
// Imports
// ────────────────────────────────────────────────────────────────
const { getDb } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AuthService = require('../services/auth.service');
const { validateRegister, validateLogin } = require('../validators/auth.validator');
const Result = require('../utils/result');

// ────────────────────────────────────────────────────────────────
// Controllers
// ────────────────────────────────────────────────────────────────
async function registerUser(req, res) {
  const validation = validateRegister(req.body);
  if (!validation.ok) {
    return res.status(400).json({ error: validation.message });
  }

  const result = await AuthService.register(req.body);

  return Result.send(res, result);
}

async function loginUser(req, res) {
  const validation = validateLogin(req.body);
  if (!validation.ok) return res.status(400).json({ error: validation.message });

  const result = await AuthService.login(req.body);
  return Result.send(res, result);
}

async function logoutUser(req, res) {
  const result = await AuthService.logout();
  return Result.send(res, result);
}

// ────────────────────────────────────────────────────────────────
// Exports
// ────────────────────────────────────────────────────────────────
module.exports = {
  registerUser,
  loginUser,
  logoutUser
};
