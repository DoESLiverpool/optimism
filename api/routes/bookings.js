const express = require('express');

const router = express.Router()
module.exports = router;

router.get('/', function(req, res) {
    res.json({
        source: req.baseUrl
    });
});

router.post('/', function(req, res) {
    res.json({
        source: req.baseUrl,
        method: req.method,
        data: req.body
    });
});
