const express = require('express');

const router = express.Router()
module.exports = router;

router.get('/', function(req, res) {
    res.render('home.html');
});

router.get('/choose-a-resource', function(req, res) {
    res.render('choose-a-resource.html');
});

router.get('/select-a-time', function(req, res) {
    res.render('select-a-time.html');
});

router.get('/your-details', function(req, res) {
    res.render('your-details.html');
});

router.get('/confirmation', function(req, res) {
    res.render('confirmation.html');
});
