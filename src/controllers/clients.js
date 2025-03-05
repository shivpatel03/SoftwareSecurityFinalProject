const pool = require('../config/db');

const addClient = async (req, res) => {
    client_name = req.body.name;
    client_address = req.body.address;

    // these are required
    if (!client_name || !client_address){
        return res.status(200).json({ error: "A name and address are required" })
    }

    try {
        await pool.execute('INSERT INTO clients (name, address) VALUES (?, ?)', [client_name, client_address]);
        res.status(201).json({ 
            message: "Client added successfully",
        });
    } catch (error) {
        console.log(error());
        res.status(500).json({ error: "An error occurred while trying to add a new client" });
    }
}