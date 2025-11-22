// ────────────────────────────────────────────────────────────────
// Imports
// ────────────────────────────────────────────────────────────────
const { MongoClient } = require('mongodb');

// ────────────────────────────────────────────────────────────────
// Configuration
// ────────────────────────────────────────────────────────────────
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = 'city_rush';

let db;

// ────────────────────────────────────────────────────────────────
// Database Connection
// ────────────────────────────────────────────────────────────────
async function connectToDatabase() {
  const client = new MongoClient(MONGO_URL);

  await client.connect();
  console.log('Connected to MongoDB Atlas');

  db = client.db(DB_NAME);
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase() first.');
  }
  return db;
}

// ────────────────────────────────────────────────────────────────
// Exports
// ────────────────────────────────────────────────────────────────
module.exports = {
  connectToDatabase,
  getDb
};
