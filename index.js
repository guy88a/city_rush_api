// ────────────────────────────────────────────────────────────────
// Imports
// ────────────────────────────────────────────────────────────────
const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();

// ────────────────────────────────────────────────────────────────
// Configuration
// ────────────────────────────────────────────────────────────────
const PORT = 3443;

// ────────────────────────────────────────────────────────────────
// SSL Certificates (Self-Signed for Local Development)
// ────────────────────────────────────────────────────────────────
const sslOptions = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

// ────────────────────────────────────────────────────────────────
// Middleware
// ────────────────────────────────────────────────────────────────
app.use(express.json());

// ────────────────────────────────────────────────────────────────
// Routes
// ────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'City Rush API over HTTPS' });
});

// ────────────────────────────────────────────────────────────────
// Server Start
// ────────────────────────────────────────────────────────────────
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`HTTPS server running at https://localhost:${PORT}`);
});
