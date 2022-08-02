const express = require('express');
const router = express.Router();
module.exports = router;

router.get('/bookings', function (req, res) {
  res.render('admin/bookings.html');
});
