const pool = require('../config/db');

const getAllJobs = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM jobs');
        res.json(rows);
    } catch (error) {
        console.log(error);
    }
}