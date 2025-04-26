const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./bridge_data.db', (err) => {
    if (err) {
        console.error('Failed to open database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

app.use(cors());

app.get('/transfers', (req, res) => {
    db.all('SELECT * FROM transfers', [], (err, rows) => {
        if (err) {
            console.error('Error reading from database:', err.message);
            return res.json([]); // 🛡️ Return empty array if database fails
        }
        res.json(rows);
    });
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));