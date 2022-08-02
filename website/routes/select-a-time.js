const express = require('express');
const axios = require('axios');
const moment = require('moment');
const utilities = require('../utilities');
const settings = require('../settings');
const UserSession = require('./userSession');

const apiUrl = settings.apiUrl;
const router = express.Router();
module.exports = router;

router.get('/select-a-time', function (req, res) {
  const resourceId = req.query.resource;

  if (!resourceId) {
    console.log('No resource id');
  }
  req.session.userSession = new UserSession();
  req.session.userSession.resourceId = resourceId;

  // Default to showing the next week...
  const fromDate = moment();
  const toDate = moment().add(6, 'days');

  const resourceUrl = `${apiUrl}/resources/${resourceId}`;
  const calendarUrl = `${apiUrl}/calendar/${fromDate.format('YYYY-MM-DD')}/${toDate.format('YYYY-MM-DD')}/${resourceId}`;
  const templateVariables = { apiUrl: settings.apiUrl };

  axios.get(resourceUrl)
    .then(function (response) {
      templateVariables.resource = response.data;
      return axios.get(calendarUrl);
    })
    .then(function (response) {
      templateVariables.calendar = response.data;
      res.render('select-a-time.html', templateVariables);
    })
    .catch(function (error) {
      console.log(error);
      res.render('error.html', {
        safeErrorMessage: utilities.safeErrorMessage(error.message)
      });
    });
});
