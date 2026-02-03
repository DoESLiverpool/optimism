const express = require('express');
const axios = require('axios');
const utilities = require('../utilities');
const settings = require('../settings');

const apiUrl = settings.apiUrl;
const router = express.Router();
module.exports = router;

router.get('/cancel-booking/:token', function (req, res) {
  const token = req.params.token;
  if (!token || token.trim() === '') {
    return res.render('error.html', {
      safeErrorMessage: utilities.safeErrorMessage('Invalid cancellation link.')
    });
  }

  const cancelUrl = `${apiUrl}/bookings/cancel/${token}`;

  axios.post(cancelUrl)
    .then(function (response) {
      res.render('cancel-booking.html', {
        success: true,
        message: 'Your booking has been cancelled successfully.'
      });
    })
    .catch(function (error) {
      console.log('Error cancelling booking:', error);
      let errorMessage = 'An error occurred while cancelling your booking.';
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'No booking found with this cancellation link.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data || 'This booking has already been cancelled or the link is invalid.';
        } else {
          errorMessage = error.response.data || errorMessage;
        }
      }
      res.render('cancel-booking.html', {
        success: false,
        message: errorMessage
      });
    });
});

