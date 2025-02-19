const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MySQL Database connection
const db = mysql.createConnection({
    host: 'kaprukareportingserver.cabbsncin1vi.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'T3llm3Reporting33#!',
    database: 'agent_rate',
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to MySQL database.');
    }
});

// Existing API to get all data
app.get('/api/data', (req, res) => {
    db.query('SELECT * FROM agent_rate', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

// 🚀 New API endpoint: Get agent-wise call count and rating count
app.get('/api/agent-stats', (req, res) => {
    const query = `
        SELECT 
            agent_name,
            COUNT(*) AS call_count,         -- Total calls per agent
            SUM(rate_count) AS rating_count -- Total ratings per agent
        FROM 
            agent_rate
        GROUP BY 
            agent_name
        ORDER BY 
            call_count DESC;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching agent stats:', err);
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
