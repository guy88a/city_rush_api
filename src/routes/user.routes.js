// src/routes/user.routes.js
const express = require('express');
const router = express.Router();

const { getMyUser } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');

// ────────────────────────────────────────────────────────────────
// User Routes
// ────────────────────────────────────────────────────────────────
router.get('/me', authMiddleware, getMyUser);

module.exports = router;
