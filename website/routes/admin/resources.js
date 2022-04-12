const express = require('express');
const axios = require('axios');
const router = express.Router();
const settings = require('../../settings');
const utilities = require('../../utilities');

const apiUrl = settings.apiUrl;
module.exports = router;

router.get('/resources', async function (req, res) {
  try {
    const resources = await axios.get(`${apiUrl}/resources`);
    res.render('admin/resources.html', { resources: resources.data });
  } catch (error) {
    console.log(error);
    res.render('error.html', {
      safeErrorMessage: utilities.safeErrorMessage(error.message)
    });
  }
});
