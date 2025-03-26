const pool = require('../config/db');

const addClient = async (req, res) => {
    client_name = req.body.name;
    client_address = req.body.address;

    // these are required
    if (!client_name || !client_address){
        return res.status(200).json({ error: "A name and address are required" })
    }

    try {
        await pool.execute('INSERT INTO client (name, address) VALUES (?, ?)', [client_name, client_address]);
        res.status(201).json({ 
            message: "Client added successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while trying to add a new client" });
    }
}

const getAllClients = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM client');
        res.json(rows);
    } catch (error) {
        console.log(error);
    }
}

const deleteClient = async (req, res) => {
    const clientId = req.body.client_id;

    if (!clientId) {
        return res.status(400).json({ error: "Client ID is required" });
    }

    try {
        await pool.query('DELETE FROM jobs WHERE client_id = ?', [clientId]);
        await pool.query('DELETE FROM client WHERE client_id = ?', [clientId]);

        res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while trying to delete the client" });
    }

        
}

module.exports = {
    addClient,
    getAllClients,
    deleteClient
}