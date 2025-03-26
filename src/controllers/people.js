const pool = require('../config/db');

const getAllContractors = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT c.person_id, p.name, p.email, p.company, p.department ' +
            'FROM contractor c ' +
            'JOIN person p ON c.person_id = p.id'
        );
        
        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            error: "An error occurred while retrieving contractors",
            details: error.message
        });
    }
}

const addContractor = async (req, res) => {
    contractor_name = req.params.name;

    contractor_pin = req.body.pin;
    contractor_email = req.body.email;
    contractor_company = req.body.company;
    contractor_dept = req.body.department;

    if (!contractor_name || !contractor_pin){
        return res.status(200).json({ error: "A name and PIN are required" })
    }

    try {
        // add the user to the person table
        const [personResult] = await pool.query('INSERT INTO person (name, email, company, department) VALUES (?, ?, ?, ?)', [contractor_name, contractor_email, contractor_company, contractor_dept])
        
        const personId = personResult.insertId;

        const uid = generateUID();

        const hash = uid + contractor_pin;

        
        // add the user to the card table
        await pool.query('INSERT INTO card (person_id, uid) VALUES (?, ?)', [personId, uid]);

        // add the user to the contractor table
        await pool.query('INSERT INTO contractor (person_id, hashed_code) VALUES (?, ?)', [personId, hash]);

        res.status(201).json({ 
            message: "Contractor added successfully",
            contractorId: personId
        });
    } catch (error) {
        // res.status(500).json(error);
        console.log(error);
        res.status(500).json({ error: "An error occurred while trying to add a new contractor" });
    }

}

const generateUID = () => {
    const min = 10000000; // 8 digits (starting from 10000000)
    const max = 99999999; // 8 digits (up to 99999999)
    return Math.floor(min + Math.random() * (max - min)).toString();
};

// check if this person is a contractor, given some PIN
const checkContractor = async (req, res) => {
    const pin = req.body.pin;
    const cardUID = req.body.uid;

    if (!pin || !cardUID) {
        return res.status(400).json({ error: "Both PIN and card UID are required" });
    }

    try {
        // Use the UID to determine which contractor it is
        const [cardRows] = await pool.query('SELECT * FROM card WHERE UID = ?', [cardUID]);
        
        // Check if card exists
        if (cardRows.length === 0) {
            return res.status(404).json({ error: "No contractor found with this card ID" });
        }
        
        const personId = cardRows[0].person_id;

        // Get person name using personId
        const [personRows] = await pool.query('SELECT name FROM person WHERE id = ?', [personId]);
        
        // Check if person exists
        if (personRows.length === 0) {
            return res.status(404).json({ error: "No person found with this ID" });
        }
        
        const contractor_name = personRows[0].name;

        // Check if there is a job for this person at this location
        const [jobRows] = await pool.query(
            'SELECT j.id, j.assigned_contractor, j.day, j.client_id, c.name AS client_name ' +
            'FROM jobs j ' +
            'JOIN client c ON j.client_id = c.client_id ' +
            'WHERE j.assigned_contractor = ? AND j.day = CURDATE()', 
            [personId]
        );
        
        if (jobRows.length === 0) {
            return res.status(200).json({ message: "No job found for " + contractor_name + " today" });
        }
        
        const client_name = jobRows[0].client_name;

        // Use the personId to get the hash and check if it's correct
        const [contractorRows] = await pool.query('SELECT * FROM contractor WHERE person_id = ?', [personId]);
        
        if (contractorRows.length === 0) {
            return res.status(404).json({ error: "Person found but not registered as a contractor" });
        }
        
        const saved_hash = contractorRows[0].hashed_code;

        // Check if the combinations are the same
        const enteredHash = cardUID + pin;
        if (enteredHash !== saved_hash) {
            return res.status(401).json({ error: "Invalid PIN" });
        } else {
            return res.status(200).json({ 
                message: contractor_name + " has a job at " + client_name + " today",
                jobId: jobRows[0].id,
                contractorId: personId,
                contractorName: contractor_name,
                clientId: jobRows[0].client_id,
                clientName: client_name,
                date: jobRows[0].day
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: "An error occurred while trying to check if this person is a contractor",
            details: error.message
        });
    }
}

const deleteContractor = async (req, res) => {
    const personId = req.body.personId;

    if (!personId) {
        return res.status(400).json({ error: "Contractor ID is required" });
    }

    try {
        await pool.query('DELETE FROM jobs WHERE assigned_contractor = ?', [personId]);
        await pool.query('DELETE FROM contractor WHERE person_id = ?', [personId]);
        await pool.query('DELETE FROM card WHERE person_id = ?', [personId]);
        await pool.query('DELETE FROM person WHERE id = ?', [personId]);


        res.status(200).json({ message: "Contractor deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while trying to delete the contractor" });
    }
};

module.exports = {
    getAllContractors,
    addContractor,
    checkContractor,
    deleteContractor
}