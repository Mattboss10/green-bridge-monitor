const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'OPTIONS'],
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
        // Create architectures table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS architectures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            energyPerValidator REAL NOT NULL,
            co2PerValidator REAL NOT NULL,
            co2PerTransaction REAL NOT NULL,
            throughput REAL NOT NULL,
            finality REAL NOT NULL,
            energyEfficiency REAL NOT NULL,
            validatorCount INTEGER NOT NULL,
            emissions TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            } else {
                // Add architecture data if the table is empty
                db.get('SELECT COUNT(*) as count FROM architectures', [], (err, row) => {
                    if (err) {
                        console.error('Error checking table:', err);
                    } else if (row.count === 0) {
                        console.log('Adding architecture data...');
                        const architectures = [
                            ['Avalanche (Subnets + ICTT)', 0.2, 0.12, 0.0001, 4500, 2, 0.2, 100, 'Lower'],
                            ['Ethereum (PoS + Bridges)', 0.4, 0.24, 0.0003, 20, 30, 0.05, 100000, 'Medium'],
                            ['Solana (PoH + Tower BFT)', 0.3, 0.18, 0.0002, 50000, 1, 0.1, 1000, 'Low']
                        ];
                        architectures.forEach(arch => {
                            db.run(
                                'INSERT INTO architectures (name, energyPerValidator, co2PerValidator, co2PerTransaction, throughput, finality, energyEfficiency, validatorCount, emissions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                arch
                            );
                        });
                    }
                });
            }
        });
    }
});

// API Routes
app.get('/api/architectures', (req, res) => {
    console.log('Received request for architectures');
    db.all('SELECT * FROM architectures', [], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Sending architectures data:', rows);
        res.json(rows);
    });
});

app.get('/api/architectures/:id', (req, res) => {
    const id = req.params.id;
    console.log('Received request for architecture:', id);
    db.get('SELECT * FROM architectures WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Architecture not found' });
            return;
        }
        console.log('Sending architecture data:', row);
        res.json(row);
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Green Bridge Monitor API is running' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});