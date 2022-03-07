const express = require('express');
const app = express();
const path = require('path');
const shortUniqueId = require('short-unique-id');
const fs = require('fs');

const uid = new shortUniqueId();

const notes  = require('./db/db');
const PORT = process.env.PORT || 3001;

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// create and file a new note
const createNewNote = (body) => {
    let curNotes = notes;
    //generate uniqe id for new note
    const id = uid();
    //create a new note
    const newNote = {};
    newNote.title = body.title;
    newNote.text = body.text;
    newNote.id = id;
    //add to existing notes
    curNotes.push(newNote);
    //write all notes to file
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'), 
        JSON.stringify(curNotes, null, 2));
    return(curNotes);
};

// GET /api/notes returns notes.json as json
app.get('/api/notes', (req, res) =>{
    let results = notes;
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

app.post('/api/notes', (req,res) => {
    const newNote = createNewNote(req.body);
    res.json(newNote);
});

// Default response for any other request (Not Found)
app.use((req,res) => {
    res.status(404).end();
});

// Start teh server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})