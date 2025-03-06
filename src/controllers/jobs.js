const pool = require('../config/db');

const getAllJobs = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM jobs');
        res.json(rows);
    } catch (error) {
        console.log(error);
    }
}

const addJobWithoutContractor = async (req, res) => {
    clientId = req.body.clientId;
    day = req.body.day; // YYYY-MM-DD

    if (!clientId || !day){
        return res.status(200).json({ error: "A client ID and day are required to set a new job" })
    }

    try {
        await pool.execute('INSERT INTO jobs (client_id, day) VALUES (?, ?)', [clientId, day]);
        res.status(201).json({ 
            message: "Job added successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while trying to add a new job" });
    }


}

const addJob = async (req, res) => {
    assigned_contractor = req.body.contractor;
    clientId = req.body.clientId;
    day = req.body.day; // YYYY-MM-DD

    if (!assigned_contractor || !clientId || !day){
        return res.status(200).json({ error: "A client ID, and day are required to set a new job" })
    }

    try {
        const [existingJobs] = await pool.execute(
            'SELECT * FROM jobs WHERE client_id = ? AND day = ?', 
            [clientId, day]
        );        
        if (existingJobs.length > 0) {
            const existingJob = existingJobs[0];
            if (!existingJob.assigned_contractor && assigned_contractor) {
                // this job exists, just doesn't have an assigned contractor
                await pool.execute(
                    'UPDATE jobs SET assigned_contractor = ? WHERE client_id = ? AND day = ?',
                    [assigned_contractor, clientId, day]
                );
                return res.status(200).json({
                    message: "Contractor assigned to existing job successfully"
                });
            } else if (existingJob.assigned_contractor && assigned_contractor) {
                await pool.execute(
                    'UPDATE jobs SET assigned_contractor = ? WHERE client_id = ? AND day = ?',
                    [assigned_contractor, clientId, day]
                );

                return res.status(200).json({
                    message: "Contractor replaced for existing job successfully"
                });
            } else  {
                // job doesn't exist, create it with this contractor
                await pool.execute(
                    'INSERT INTO jobs (assigned_contractor, client_id, day) VALUES (?, ?, ?)', 
                    [assigned_contractor, clientId, day]
                );
                
                return res.status(201).json({ 
                    message: "New job created successfully"
                });
            }
        }
        await pool.execute('INSERT INTO jobs (assigned_contractor, client_id, day) VALUES (?, ?, ?)', [assigned_contractor, clientId, day]);
        res.status(201).json({ 
            message: "Job added successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while trying to add a new job with contractor" });
    }
}

module.exports = {
    getAllJobs,
    addJobWithoutContractor,
    addJob
}