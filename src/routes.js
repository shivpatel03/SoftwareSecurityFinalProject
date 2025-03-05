const express = require('express');
const router = express.Router();

const peopleController = require('./controllers/people');

// route to get all contractors
router.get('/test', peopleController.getAllPeople);

module.exports = router;