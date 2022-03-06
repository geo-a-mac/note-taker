const express = require('express');
const app = express();
const path = require('path');
const shortUniqueId = require('short-unique-id');

// const uid = new ShortUniqueId();

const db = require('./db/db');
const PORT = process.env.PORT || 3001;

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET /api/notes returns notes.json as json
app.get('/api/notes', (req, res) =>{
    let results = db;
    res.json(results);
});

// notes returns notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// other calls return index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Default response for any other request (Not Found)
app.use((req,res) => {
    res.status(404).end();
});


// Start teh server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})