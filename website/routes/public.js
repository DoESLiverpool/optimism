const express = require('express');
const axios = require('axios');
const moment = require('moment');
const utilities = require('../utilities');
const settings = require('../settings');

const apiUrl = settings.apiUrl;
const router = express.Router();
module.exports = router;

router.get('/', function (req, res) {
  res.render('home.html');
});

router.post('/your-details', function (req, res) {
  const resourceId = req.body.resource;
  const startTime = req.body.start;
  const endTime = req.body.finish;
  const templateVariables = { apiUrl: settings.apiUrl, startTime: startTime, endTime: endTime };
  // TODO: user-supplied POST parameters need to be validated
  if (resourceId === undefined || resourceId == null) {
    return res.render('error.html', {
      safeErrorMessage: utilities.safeErrorMessage('No resourceId was present in POST data.')
    });
  }
  if (req.session.userSession.resourceId !== resourceId) {
    return res.render('error.html', {
      safeErrorMessage: utilities.safeErrorMessage('ResourceId does not match.')
    });
  }
  if (startTime === undefined || startTime == null) {
    return res.render('error.html', {
      safeErrorMessage: utilities.safeErrorMessage('No start time was present in POST data.')
    });
  }
  if (endTime === undefined || endTime == null) {
    return res.render('error.html', {
      safeErrorMessage: utilities.safeErrorMessage('No end time  was present in POST data.')
    });
  }
  if (req.session.userSession === undefined) {
    return res.render('error.html', {
      safeErrorMessage: utilities.safeErrorMessage('No user session has been created.')
    });
  }

  req.session.userSession.starts = startTime;
  req.session.userSession.ends = endTime;
  const resourceUrl = `${apiUrl}/resources/${resourceId}`;

  axios.get(resourceUrl)
    .then(function (response) {
      templateVariables.resource = response.data;
      req.session.userSession.resourceName = response.data.name;
      templateVariables.friendlyStartTime = moment(startTime).format('llll');
      templateVariables.friendlyEndTime = moment(endTime).format('llll');
      res.render('your-details.html', templateVariables);
    })
    .catch(function (error) {
      console.log(error);
      res.render('error.html', {
        safeErrorMessage: utilities.safeErrorMessage(error.message)
      });
    });
});

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
