const express = require('express');
const router = express.Router();

const peopleController = require('./controllers/people');

// get all contractors
router.get('/contractors', peopleController.getAllPeople);

// add a new contractor (body should have PIN, email, company, department)
router.post('/contractor/:name', peopleController.addContractor);

// check if a person is a contractor (body should have PIN and card UID), should be called when user enters the facility and enters their PIN
router.get('/check-contractor', peopleController.checkContractor);


router.get('jobs', peopleController.getAllJobs);

module.exports = router;