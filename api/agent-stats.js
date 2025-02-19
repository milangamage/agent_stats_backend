const mysql = require('mysql2/promise');

module.exports = async (req, res) => {
    // ✅ Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins (for development)
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });

        const [rows] = await db.execute(`
      SELECT 
        agent_name,
        COUNT(*) AS call_count,
        SUM(rate_count) AS rating_count
      FROM 
        agent_rate
      GROUP BY 
        agent_name
      ORDER BY 
        call_count DESC;
    `);

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching agent stats:', error);
        res.status(500).json({ error: 'Error fetching agent stats' });
    }
};
