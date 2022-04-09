const express = require('express');
const router = express.Router();
module.exports = router;

router.get('/login', function (req, res) {
  res.render('admin/login.html');
});

router.post('/login', function (req, res) {
  req.session.isAdmin = true;
  res.writeHead(302, {
    Location: '/admin'
  }).end();
});
