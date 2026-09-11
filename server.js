const express = require('express');
const initializeDatabase = require('./database');
const app = express();

// ... Keep your existing app.use() and view engine configuration here ...

// Wrap your routes and server startup inside an async function
async function startServer() {
    const db = await initializeDatabase();

    // Fix your homepage routing line here (Line 20)
    app.get('/', (req, res) => {
        res.render('form');
    });

    // Update your POST route handler to use await for DB queries
    app.post('/generate-profile', async (req, res) => {
        try {
            const { name, bio, skills, linkedin, github } = req.body;

            // Example of inserting into the new async DB structure:
            await db.run(
                `INSERT INTO profiles (name, bio, skills, social_links) VALUES (?, ?, ?, ?)`,
                [name, bio, skills, JSON.stringify({ linkedin, github })]
            );

            // Fetch or pass the record to your card profile template view
            res.render('profile', { profile: { name, bio, skills, socialLinks: { linkedin, github } } });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error generating profile card.");
        }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}

// Execute the server
startServer().catch(err => console.error("Server startup failed:", err));

