// server.js — Our Node.js backend server

// Step 1: Load the tools we installed
const express = require('express');      // the web server framework
const cors    = require('cors');         // allows browser to talk to server
const path    = require('path');         // helps build file paths
const Database = require('better-sqlite3'); // sqlite database tool
require('dotenv').config();              // loads our .env file

// Step 2: Create the Express app
const app  = express();
const PORT = process.env.PORT || 3000;  // use port from .env, or 3000

// Step 3: Tell Express what kind of data to accept
app.use(cors());                         // allow all cross-origin requests
app.use(express.json());                 // accept JSON data from the browser
app.use(express.static('.'));            // serve our HTML/CSS/JS files

// Step 4: Connect to (or create) the database
const db = new Database('./db/inquiries.db');

// Step 5: Create the inquiries table if it doesn't exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS inquiries (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT NOT NULL,
    email        TEXT NOT NULL,
    phone        TEXT DEFAULT '',
    subject      TEXT NOT NULL,
    message      TEXT NOT NULL,
    submitted_at TEXT DEFAULT (datetime('now'))
  )
`);

// Step 6: Create the API route that receives form data
// When the browser sends a POST request to /api/contact, this runs
app.post('/api/contact', (req, res) => {

  // Pull the fields out of the request body
  const { name, email, phone, subject, message } = req.body;

  // Basic validation — make sure required fields are present
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields.'
    });
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.'
    });
  }

  // Insert the data into the database
  try {
    const insert = db.prepare(`
      INSERT INTO inquiries (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `);
    insert.run(name, email, phone || '', subject, message);

    // Send success response back to browser
    res.json({ success: true, message: 'Message saved successfully!' });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.'
    });
  }
});

// Step 7: Create a route to view all saved inquiries (for testing)
app.get('/api/inquiries', (req, res) => {
  const rows = db.prepare('SELECT * FROM inquiries ORDER BY id DESC').all();
  res.json(rows);
});

// Step 8: Start the server and listen for requests
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Open your website at http://localhost:${PORT}/index.html`);
});