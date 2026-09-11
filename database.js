const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function initializeDatabase() {
  // Open the SQLite database file using absolute paths for Render
  const db = await open({
    filename: path.join(__dirname, 'profiles.db'),
    driver: sqlite3.Database
  });

  // Create the profiles table if it doesn't exist
  await db.exec(`
        CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            bio TEXT,
            skills TEXT,
            social_links TEXT
        )
    `);

  console.log("✅ SQLite Database initialized successfully!");
  return db;
}

// Export the initialization function
module.exports = initializeDatabase;
