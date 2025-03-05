const express = require('express');
const router = express.Router();

const peopleController = require('./controllers/people');
const jobController = require('./controllers/jobs');
const clientController = require('./controllers/client');

// get all contractors
router.get('/contractors', peopleController.getAllPeople);

// add a new contractor (body should have PIN, email, company, department)
router.post('/contractor/:name', peopleController.addContractor);

// check if a person is a contractor (body should have PIN and card UID), should be called when user enters the facility and enters their PIN
router.get('/check-contractor', peopleController.checkContractor);


// get all assigned jobs
router.get('/jobs', jobController.getAllJobs);

// add a new job
router.post('/add-jobs', jobController.addJob);


// add a new client (body should have name and address)
router.post('/add-client', clientController.addClient);

module.exports = router;