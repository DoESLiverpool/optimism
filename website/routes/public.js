const express = require('express');
const axios = require('axios');
const moment = require('moment');
const utilities = require('../utilities');
const settings = require('../settings');

const apiUrl = settings.apiUrl;
const router = express.Router()
module.exports = router;

router.get('/', function(req, res) {
    res.render('home.html');
});

router.get('/your-details', function(req, res) {
    const resourceId = req.query.resource;
    const startTime = req.query.start;
    const endTime = req.query.finish;
    const templateVariables = { apiUrl: settings.apiUrl, startTime: startTime, endTime: endTime };

    // Check we have the required details
    if (!resourceId) {
        console.log('No resource id');
    }
    if (!startTime) {
        console.log('No start time');
    }
    if (!endTime) {
        console.log('No end time');
    }

    const resourceUrl = `${apiUrl}/resources/${resourceId}`;

    axios.get(resourceUrl)
        .then(function (response) {
            templateVariables.resource = response.data;
            // Create nicer-looking date/times for display
            templateVariables.friendlyStartTime = moment(startTime).format('llll');
            templateVariables.friendlyEndTime = moment(endTime).format('llll');
            res.render('your-details.html', templateVariables);
        })
        .catch(function (error) {
            console.log(error);
            res.render('error.html', {
                safeErrorMessage: utilities.safeErrorMessage(error.message)
            });
        });
});

router.post('/confirmation', function(req, res) {
    // Check that we've got the relevant info:
    //   resource
    //   start
    //   finish
    //   name
    //   email
    //   notes 
    // Then call the API to make the booking
    res.render('confirmation.html');
});
