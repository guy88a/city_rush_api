// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();

const { 
  registerUser, 
  loginUser, 
  logoutUser 
} = require('../controllers/auth.controller');

// ────────────────────────────────────────────────────────────────
// Auth Routes
// ────────────────────────────────────────────────────────────────
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router;
