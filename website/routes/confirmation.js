const express = require('express');
const axios = require('axios');
const moment = require('moment');
const utilities = require('../utilities');
const settings = require('../settings');

const apiUrl = settings.apiUrl;
const router = express.Router();
module.exports = router;

router.post('/confirmation', function (req, res) {
  const resourceId = req.body.resourceId;
  const name = req.body.name;
  const email = req.body.email;
  const starts = req.body.starts;
  const ends = req.body.ends;
  const notes = req.body.notes;
  if (resourceId === undefined || name === undefined || starts === undefined ||
      ends === undefined || notes === undefined) {
    res.status(500).end();
    return;
  }
  const bookingsUrl = `${apiUrl}/bookings`;
  const postData = {
    resourceId: resourceId,
    name: name,
    email: email,
    starts: moment(starts),
    ends: moment(ends),
    notes: notes
  };

  axios.post(bookingsUrl, postData)
    .then(function (response) {
      res.render('confirmation.html', req.session);
    })
    .catch(function (error) {
      console.log(error);
      res.render('error.html', {
        safeErrorMessage: utilities.safeErrorMessage(error.message)
      });
    });
});
