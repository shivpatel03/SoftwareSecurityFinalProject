const express = require('express');
const router = express.Router();

const peopleController = require('./controllers/people');
const jobController = require('./controllers/jobs');
const clientController = require('./controllers/clients');

router.get('/contractors', peopleController.getAllContractors); // get all contractors
router.post('/contractor/:name', peopleController.addContractor); // add new contractor (body includes PIN, email, company, department)
router.post('/check-contractor', peopleController.checkContractor); // validates contractor (body includes PIN and card UID)
router.delete('/delete-contractor', peopleController.deleteContractor); // deletes contractor (body includes person ID)

router.get('/jobs', jobController.getAllJobs); // get all jobs
router.post('/add-empty-job', jobController.addJobWithoutContractor) // add a job (body includes client ID and day of work)
router.post('/add-job', jobController.addJob); // add a job (body includes contractor, client ID, and day of work) - if there is already an assignee, this will replace them
router.post('/complete-job', jobController.completeJob); // complete a job (body includes job ID)
router.delete('/delete-job', jobController.deleteJob); // delete an existing job that is coming up (body includes job ID)

router.post('/add-client', clientController.addClient); // add a client to the system (body includes client's name and building address)
router.get('/clients', clientController.getAllClients); // get all clients 
router.delete('/delete-client', clientController.deleteClient); // delete a specific client and all jobs (body includes client ID)

module.exports = router;