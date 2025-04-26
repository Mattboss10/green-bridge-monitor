require('dotenv').config();
const { ethers } = require('ethers');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

// Setup RPC provider
const provider = new ethers.providers.JsonRpcProvider(process.env.FUJI_RPC);

// Addresses
const TELEPORTER_MESSENGER = '0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf';

// Setup database
let db = new sqlite3.Database('./bridge_data.db');
db.run(`CREATE TABLE IF NOT EXISTS transfers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fromChain TEXT,
    toChain TEXT,
    amount TEXT,
    timestamp INTEGER,
    carbonSaved REAL
)`);

// Listen for bridge events
async function startListener() {
    console.log("Listening for Teleporter bridge events on Fuji...");

    provider.on({
        address: TELEPORTER_MESSENGER,
        topics: []
    }, async (log) => {
        console.log("New Warp/Teleporter event!");

        try {
            const parsedLog = ethers.utils.defaultAbiCoder.decode(
                ["bytes32", "uint64", "address", "address", "bytes"],
                log.data
            );

            const [messageID, destChainID, sender, recipient, payload] = parsedLog;
            const block = await provider.getBlock(log.blockNumber);
            const timestamp = block.timestamp;

            // Example amount (later you can properly parse payload)
            const amount = ethers.utils.formatEther('1000000000000000000');

            const carbonSaved = await estimateCarbonSaved();

            db.run(`INSERT INTO transfers (fromChain, toChain, amount, timestamp, carbonSaved) VALUES (?, ?, ?, ?, ?)`,
                ['Fuji', `Chain ${destChainID}`, amount, timestamp, carbonSaved]);

            console.log(`Saved: ${amount} bridged to Chain ${destChainID} - ${carbonSaved}g CO₂ saved.`);
        } catch (err) {
            console.error("Error decoding log:", err);
        }
    });
}

// Call Carbon Ratings API to estimate emissions savings
async function estimateCarbonSaved() {
    try {
        const response = await axios.get('https://api.carbon-ratings.com/v2/emissions/estimate', {
            headers: { 'x-api-key': process.env.CARBON_API_KEY }
        });

        const avaxEmissions = response.data.estimate_g_co2 || 2; // Avalanche TX footprint
        const altBridgeEmissions = 100; // Assume 100g for typical bridge TX

        return altBridgeEmissions - avaxEmissions;
    } catch (error) {
        console.error('Error fetching carbon estimate:', error.message);
        return 0;
    }
}

startListener();