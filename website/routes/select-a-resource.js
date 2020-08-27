const express = require('express');

const router = express.Router()
module.exports = router;

router.get('/select-a-resource', function(req, res) {


    
    res.render('select-a-resource.html');
});
