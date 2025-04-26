const sqlite3 = require('sqlite3').verbose();

// Connect to your database
const db = new sqlite3.Database('./bridge_data.db');

// Create the transfers table
db.run(`CREATE TABLE IF NOT EXISTS transfers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fromChain TEXT,
    toChain TEXT,
    amount TEXT,
    timestamp INTEGER,
    carbonSaved REAL
)`, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
        console.log('✅ Table "transfers" created successfully.');
    }
});

// Close the database
db.close();