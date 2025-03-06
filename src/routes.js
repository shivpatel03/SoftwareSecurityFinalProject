const express = require('express');
const router = express.Router();

const peopleController = require('./controllers/people');
const jobController = require('./controllers/jobs');
const clientController = require('./controllers/clients');

router.get('/contractors', peopleController.getAllContractors); // get all contractors
router.post('/contractor/:name', peopleController.addContractor); // add new contractor (body includes PIN, email, company, department)
router.get('/check-contractor', peopleController.checkContractor); // validates contractor (body includes PIN and card UID)

router.get('/jobs', jobController.getAllJobs); // get all jobs
router.post('/add-empty-job', jobController.addJobWithoutContractor) // add a job (body includes client ID and day of work)
router.post('/add-job', jobController.addJob); // add a job (body includes contractor, client ID, and day of work) - if there is already an assignee, this will replace them

router.post('/add-client', clientController.addClient); // add a client to the system (body includes client's name and building address)
router.get('/clients', clientController.getAllClients); // get all clients 

module.exports = router;