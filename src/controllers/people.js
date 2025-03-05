const pool = require('../config/db');

const getAllPeople = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM person');
        res.json(rows);
    } catch (error) {
        console.log(error);
    }
}   

module.exports = {
    getAllPeople
}