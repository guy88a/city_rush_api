// ────────────────────────────────────────────────────────────────
// Imports
// ────────────────────────────────────────────────────────────────
require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const { connectToDatabase } = require('./src/config/database');

// ────────────────────────────────────────────────────────────────
// Configuration
// ────────────────────────────────────────────────────────────────
const MONGO_URL = process.env.MONGO_URL;
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
app.use('/api', require('./src/routes'));

app.get('/', (req, res) => {
  res.json({ message: 'City Rush API over HTTPS, connected to MongoDB' });
});

// ────────────────────────────────────────────────────────────────
// Server Start
// ────────────────────────────────────────────────────────────────
connectToDatabase().then(() => {
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HTTPS server running at https://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});
