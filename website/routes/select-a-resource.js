const express = require('express');
const axios = require('axios');
const utilities = require('../utilities');
const settings = require('../settings');

const apiUrl = settings.apiUrl;

const router = express.Router()
module.exports = router;

router.get('/select-a-resource', function (req, res) {

    const url = `${apiUrl}/resources`;

    axios.get(url)
        .then(function (response) {
            res.render('select-a-resource.html', {
                resources: response.data
            });
        })
        .catch(function (error) {
            console.log(error);
            res.render('error.html', {
                safeErrorMessage: utilities.safeErrorMessage(error.message)
            });
        });
});
