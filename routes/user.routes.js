// ────────────────────────────────────────────────────────────────
// Imports
// ────────────────────────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const { getMyUser } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');

// ────────────────────────────────────────────────────────────────
// Routes
// ────────────────────────────────────────────────────────────────
router.get('/me', authMiddleware, getMyUser);

// ────────────────────────────────────────────────────────────────
// Exports
// ────────────────────────────────────────────────────────────────
module.exports = router;
