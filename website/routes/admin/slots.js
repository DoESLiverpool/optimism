const express = require('express');
const router = express.Router();
module.exports = router;

router.get('/slots', function (req, res) {
  res.render('admin/slots.html');
});
