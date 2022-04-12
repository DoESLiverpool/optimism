const express = require('express');
const router = express.Router();
module.exports = router;

router.get('/login', function (req, res) {
  res.render('admin/login.html', { showError: false });
});

router.post('/login', function (req, res) {
  const user = req.body.user;
  const password = req.body.password;

  if (user === 'someone@example.org' && password === 'password') {
    let redirect = req.query.redirect;
    if (redirect === undefined) {
      redirect = '/admin';
    }
    if (!(redirect === '/admin' || redirect.startsWith('/admin/'))) {
      redirect = '/admin';
    }
    req.session.isAdmin = true;
    res.redirect(redirect);
  } else {
    res.render('admin/login.html', {
      showError: true,
      message: 'Could not sign in using these details.'
    });
  }
});
