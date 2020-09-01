const express = require('express');
const axios = require('axios');
const utilities = require('../utilities');
const settings = require('../settings');

const apiUrl = settings.apiUrl;
const router = express.Router()
module.exports = router;

router.get('/select-a-time', function (req, res) {

    const resourceId = req.query.resource;

    if (!resourceId) {
        console.log('No resource id');
    }

    const resourceUrl = `${apiUrl}/resources/${resourceId}`;
    const calendarUrl = `${apiUrl}/calendar/2020-08-25/2020-09-01/1`;
    const templateVariables = {};

    axios.get(resourceUrl)
        .then(function (response) {
            templateVariables.resource = response.data;
            return axios.get(calendarUrl);
        })
        .then(function(response) {
            templateVariables.calendar = response.data;
            res.render('select-a-time.html', templateVariables);
        })
        .catch(function (error) {
            console.log(error);
            res.render('error.html', {
                safeErrorMessage: utilities.safeErrorMessage(error.message)
            });
        });

});
