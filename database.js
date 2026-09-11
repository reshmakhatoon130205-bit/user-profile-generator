const path = require('path');
const Database = require('better-sqlite3');

// Fix: Use an absolute path so Render can locate the database file reliably
const db = new Database(path.join(__dirname, 'profiles.db'));

// Automatically create the profiles table if it does not exist
db.prepare(`
CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    bio TEXT,
    skills TEXT,
    social_links TEXT
)
`).run();

// CRITICAL FIX: Export the db instance so server.js can use it!
module.exports = db;
