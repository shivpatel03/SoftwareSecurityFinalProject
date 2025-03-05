const pool = require('../config/db');

const getAllPeople = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM contractors');
        res.json(rows);
    } catch (error) {
        console.log(error);
    }
}   

const addContractor = async (req, res) => {
    pin = req.body.pin;
    contractor_name = req.params.name;
    contractor_email = req.body.email;
    contractor_company = req.body.company;
    contractor_dept = req.body.department;

    if (!contractor_name || !pin){
        return res.status(200).json({ error: "A name and PIN are required" })
    }

    try {
        // add the user to the person table
        const [personResult] = await pool.query('INSERT INTO person (name, email, company, department) VALUES (?, ?, ?, ?)', [contractor_name, contractor_email, contractor_company, contractor_dept])
        
        const personId = personResult.insertId;

        const uid = generateUID();

        const hash = uid + pin;

        
        // add the user to the card table
        await pool.query('INSERT INTO card (personId, uid) VALUES (?, ?)', [personId, uid]);

        // add the user to the contractor table
        await pool.query('INSERT INTO contractor (personId, hash) VALUES (?, ?)', [personId, hash]);

        res.status(201).json({ 
            message: "Contractor added successfully",
            contractorId: personId
        });
    } catch (error) {
        console.log(error());
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

    if (!pin) {
        return res.status(200).json({ error: "A PIN is required" });
    }

    try {
        // use the UID to determine which contracto r it is
        const [rows] = await pool.query('SELECT * FROM card WHERE uid = ?', [cardUID]);
        personId = rows[0].personId;

        // get person name using personId
        const [personRows] = await pool.query('SELECT name FROM person WHERE id = ?', [personId]);
        const contractor_name = personRows[0].name;

        // use the personId to get the hash and check if it's correct
        const [contractorRows] = await pool.query('SELECT * FROM contractor WHERE personId = ?', [personId]);
        const saved_hash = contractorRows[0].hash;

        // check if the combinations are the same
        enteredHash = cardUID + pin;
        if (enteredHash != saved_hash) {
            return res.status(200).json({ error: "Invalid PIN" });
        } else {
            return res.status(200).json({ message: "Welcome, " + contractor_name + "!" });
        }
    } catch (error) {
        res.status(500).json({ error: "An error occurred while trying to check if this person is a contractor" });
    }
}


module.exports = {
    getAllPeople,
    addContractor,
    checkContractor
}