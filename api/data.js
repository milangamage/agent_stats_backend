const mysql = require('mysql2/promise');

module.exports = async (req, res) => {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });

    try {
        const [rows] = await db.execute('SELECT * FROM agent_rate');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching data' });
    } finally {
        await db.end();
    }
};
