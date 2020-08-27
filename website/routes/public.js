const express = require('express');

const router = express.Router()
module.exports = router;

router.get('/', function(req, res) {
    res.render('home.html');
});

router.get('/select-a-time', function(req, res) {
    test_thing = {
        name: 'thing',
        description: 'thing is a thing'
    };

    res.render('select-a-time.html', {
            title: 'hello',
            thing: test_thing
        });
});

router.get('/your-details', function(req, res) {
    res.render('your-details.html');
});

router.get('/confirmation', function(req, res) {
    res.render('confirmation.html');
});
