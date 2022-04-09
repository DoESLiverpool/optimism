const express = require('express');
const router = express.Router();
module.exports = router;

router.get('/login', function (req, res) {
  res.render('admin/login.html');
});

router.post('/login', function (req, res) {
  let redirect = req.query.redirect;
  if (redirect === undefined) {
    redirect = '/admin';
  }
  if (!(redirect === '/admin' || redirect.startsWith('/admin/'))) {
    redirect = '/admin';
  }
  req.session.isAdmin = true;
  res.redirect(redirect);
});
