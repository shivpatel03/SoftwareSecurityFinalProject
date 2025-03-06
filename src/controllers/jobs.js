const pool = require('../config/db');

const getAllJobs = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM jobs');
        res.json(rows);
    } catch (error) {
        console.log(error);
    }
}

const addJob = async (req, res) => {
    assigned_contractor = req.body.contractor;
    clientId = req.body.clientId;
    day = req.body.day; // YYYY-MM-DD

    if (!assigned_contractor || !clientId || !day){
        return res.status(200).json({ error: "A contractor, client ID, and day are required to set a new job" })
    }

    try {
        await pool.execute('INSERT INTO jobs (assigned_contractor, client_id, day) VALUES (?, ?, ?)', [assigned_contractor, clientId, day]);
        res.status(201).json({ 
            message: "Job added successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while trying to add a new job" });
    }
}

module.exports = {
    getAllJobs,
    addJob
}