const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
    origin: '*', // Allow all origins for now
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

// Middleware
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
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            } else {
                // Add some test data if the table is empty
                db.get('SELECT COUNT(*) as count FROM transfers', [], (err, row) => {
                    if (err) {
                        console.error('Error checking table:', err);
                    } else if (row.count === 0) {
                        console.log('Adding test data...');
                        const testData = [
                            ['fuji', 'chain', 1000, 50],
                            ['chain', 'fuji', 500, 25],
                            ['fuji', 'chain', 2000, 100]
                        ];
                        testData.forEach(data => {
                            db.run(
                                'INSERT INTO transfers (fromChain, toChain, amount, carbonSaved) VALUES (?, ?, ?, ?)',
                                data
                            );
                        });
                    }
                });
            }
        });
    }
});

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Green Bridge Monitor API is running' });
});

// API Routes
app.get('/api/transfers', (req, res) => {
    console.log('Received request for transfers');
    db.all('SELECT * FROM transfers ORDER BY timestamp DESC', [], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Sending transfers data:', rows);
        res.json(rows);
    });
});

app.post('/api/transfers', (req, res) => {
    const { fromChain, toChain, amount, carbonSaved } = req.body;
    console.log('Received new transfer:', { fromChain, toChain, amount, carbonSaved });
    db.run(
        'INSERT INTO transfers (fromChain, toChain, amount, carbonSaved) VALUES (?, ?, ?, ?)',
        [fromChain, toChain, amount, carbonSaved],
        function(err) {
            if (err) {
                console.error('Database error:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            console.log('Transfer inserted with ID:', this.lastID);
            res.json({ id: this.lastID });
        }
    );
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;