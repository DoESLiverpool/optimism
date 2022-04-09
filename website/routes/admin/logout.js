const express = require('express');
const router = express.Router();
module.exports = router;

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.writeHead(302, {
    Location: '/admin/login'
  }).end();
});
