const express = require('express');
const router = express.Router();
module.exports = router;

router.get('/resources', function (req, res) {
  res.render('admin/resources.html');
});
