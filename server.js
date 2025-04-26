const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Create table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS transfers (
    id SERIAL PRIMARY KEY,
    fromChain TEXT NOT NULL,
    toChain TEXT NOT NULL,
    amount REAL NOT NULL,
    carbonSaved REAL NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => console.error('Error creating table:', err));

// API Routes
app.get('/api/transfers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transfers ORDER BY timestamp DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching transfers:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/transfers', async (req, res) => {
  const { fromChain, toChain, amount, carbonSaved } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO transfers (fromChain, toChain, amount, carbonSaved) VALUES ($1, $2, $3, $4) RETURNING id',
      [fromChain, toChain, amount, carbonSaved]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error('Error inserting transfer:', err);
    res.status(500).json({ error: err.message });
  }
});

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'green-bridge-dashboard/dist')));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'green-bridge-dashboard/dist/index.html'));
});

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;