const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err);
    } else {
        console.log('Connected to SQLite database.');
        // Create transfers table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS transfers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fromChain TEXT NOT NULL,
            toChain TEXT NOT NULL,
            amount REAL NOT NULL,
            carbonSaved REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// API Routes
app.get('/api/transfers', (req, res) => {
    db.all('SELECT * FROM transfers ORDER BY timestamp DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/transfers', (req, res) => {
    const { fromChain, toChain, amount, carbonSaved } = req.body;
    db.run(
        'INSERT INTO transfers (fromChain, toChain, amount, carbonSaved) VALUES (?, ?, ?, ?)',
        [fromChain, toChain, amount, carbonSaved],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
});

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'green-bridge-dashboard/dist')));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'green-bridge-dashboard/dist/index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;