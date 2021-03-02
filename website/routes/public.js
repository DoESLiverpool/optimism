const express = require('express');
const axios = require('axios');
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
            res.render('your-details.html', templateVariables);
        })
        .catch(function (error) {
            console.log(error);
            res.render('error.html', {
                safeErrorMessage: utilities.safeErrorMessage(error.message)
            });
        });
});

router.get('/confirmation', function(req, res) {
    res.render('confirmation.html');
});
