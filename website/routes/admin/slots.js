const express = require('express');
const axios = require('axios');
const router = express.Router();
const settings = require('../../settings');
const utilities = require('../../utilities');

const apiUrl = settings.apiUrl;
module.exports = router;

router.get('/slots', async function (req, res) {
  try {
    const slots = await axios.get(`${apiUrl}/slots`);
    res.render('admin/slots/view.html', {
      pageName: 'Time slots',
      breadCrumbs: {},
      slots: slots.data
    });
  } catch (error) {
    console.log(error);
    res.render('error.html', {
      safeErrorMessage: utilities.safeErrorMessage(error.message)
    });
  }
});

router.get('/slots/create', async function (req, res) {
  res.render('admin/slots/create.html', {
    pageName: 'Create',
    breadCrumbs: [
      { name: 'Time slots', link: '/admin/slots' }
    ],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  });
});

router.post('/slots/create', async function (req, res) {
  const name = req.body.name;
  try {
    await axios.post(`${apiUrl}/resource-types`, {
      name: name
    });
    res.redirect('/admin/resource-types');
  } catch (error) {
    console.log(error);
    res.render('error.html', {
      safeErrorMessage: utilities.safeErrorMessage(error.message)
    });
  }
});
