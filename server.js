const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    const profiles = db.prepare('SELECT * FROM profiles ORDER BY id DESC').all();
    const formattedProfiles = profiles.map(p => ({
        ...p,
        skills: p.skills ? p.skills.split(',').map(s => s.trim()) : [],
        socialLinks: p.social_links ? JSON.parse(p.social_links) : {}
    }));
    res.render('form', { profiles: formattedProfiles, newProfile: null });
});

app.post('/generate', (req, res) => {
    let { name, bio, skills, github, linkedin } = req.body;
    name = name ? name.trim() : 'Anonymous';
    bio = bio ? bio.trim() : 'No bio provided.';
    const skillsArray = skills ? skills.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
    const skillsString = skillsArray.join(', ');
    const socialLinks = { github: github ? github.trim() : '', linkedin: linkedin ? linkedin.trim() : '' };

    const insert = db.prepare('INSERT INTO profiles (name, bio, skills, social_links) VALUES (?, ?, ?, ?)');
    insert.run(name, bio, skillsString, JSON.stringify(socialLinks));

    const profiles = db.prepare('SELECT * FROM profiles ORDER BY id DESC').all();
    const formattedProfiles = profiles.map(p => ({
        ...p,
        skills: p.skills ? p.skills.split(',').map(s => s.trim()) : [],
        socialLinks: p.social_links ? JSON.parse(p.social_links) : {}
    }));

    res.render('index', { profiles: formattedProfiles, newProfile: { name, bio, skills: skillsArray, socialLinks } });
});
app.listen(PORT, '0.0.0.0', () => console.log(`Server running at port ${PORT}`));

const path = require('path');

// Bad: res.sendFile('./public/index.html');
// Good:
res.sendFile(path.join(__dirname, 'public', 'index.html')); 
