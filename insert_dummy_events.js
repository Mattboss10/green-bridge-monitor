const sqlite3 = require('sqlite3').verbose();

// Connect to your local database
const db = new sqlite3.Database('./bridge_data.db');

// Helper to generate random dummy data
function getRandomAmount() {
    return (Math.random() * (10 - 0.1) + 0.1).toFixed(2); // Between 0.1 and 10 tokens
}

function getRandomCarbonSaved() {
    return (Math.random() * (100 - 5) + 5).toFixed(2); // Between 5g and 100g saved
}

function getRandomTimestamp(daysAgo) {
    const now = Math.floor(Date.now() / 1000);
    return now - (daysAgo * 86400); // 86400 seconds = 1 day
}

// Insert N dummy transfers
function insertDummyTransfers(count = 10) {
    for (let i = 0; i < count; i++) {
        const fromChain = 'Fuji';
        const toChain = `Chain${Math.floor(Math.random() * 10000)}`; // Random Chain ID
        const amount = getRandomAmount();
        const timestamp = getRandomTimestamp(Math.floor(Math.random() * 7)); // Within last 7 days
        const carbonSaved = getRandomCarbonSaved();

        db.run(`INSERT INTO transfers (fromChain, toChain, amount, timestamp, carbonSaved) VALUES (?, ?, ?, ?, ?)`,
            [fromChain, toChain, amount, timestamp, carbonSaved],
            function (err) {
                if (err) {
                    return console.error('Error inserting dummy event:', err.message);
                }
                console.log(`Dummy event #${i + 1} inserted.`);
            }
        );
    }
}

insertDummyTransfers(15); // ✅ Insert 15 dummy bridge events

db.close();