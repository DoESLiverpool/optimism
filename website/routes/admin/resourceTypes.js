const express = require('express');
const router = express.Router();
module.exports = router;

router.get('/resource-types', function (req, res) {
  res.render('admin/resource-types.html');
});
